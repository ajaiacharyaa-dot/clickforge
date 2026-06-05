import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * Upload image to Cloudinary.
 * - If CLOUDINARY_API_KEY & CLOUDINARY_API_SECRET are present, use signed server-side upload via SDK.
 * - Otherwise fall back to unsigned upload using upload preset `clickforge_thumbnails`.
 *
 * Returns: secure_url string on success; throws on failure.
 */
export const uploadImage = async (file: File): Promise<string> => {
  // Signed server-side upload if credentials available
  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer())

      return await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'clickforge',
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            resource_type: 'image',
          },
          (err: any, result: any) => {
            if (err) return reject(err)
            if (!result?.secure_url) return reject(new Error('Upload did not return secure_url'))
            resolve(result.secure_url)
          }
        )

        uploadStream.on('error', (err) => reject(err))
        uploadStream.end(buffer)
      })
    } catch (err) {
      console.error('Cloudinary signed upload error:', err)
      throw new Error('Failed to upload image to Cloudinary (signed)')
    }
  }

  // Unsigned fallback (ensure upload preset 'clickforge_thumbnails' exists)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)')
  }

  try {
    const formData = new FormData()
    formData.append('file', file as any)
    formData.append('upload_preset', 'clickforge_thumbnails')

    const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await resp.json()
    if (!resp.ok || !data?.secure_url) {
      console.error('Cloudinary unsigned upload failed', { status: resp.status, body: data })
      throw new Error('Unsigned upload failed')
    }

    return data.secure_url
  } catch (err) {
    console.error('Cloudinary unsigned upload error:', err)
    throw new Error('Failed to upload image to Cloudinary (unsigned)')
  }
}

/**
 * Build a Cloudinary fetch URL overlaying text onto a remote image.
 * Uses cloudinary.url with an overlay transformation object to ensure correct encoding.
 *
 * Notes:
 * - Keeps overlay simple: font, size, color, gravity, y offset, layer_apply flag.
 * - Limits text length to avoid overly long URL segments.
 */
export const addTextToImage = (imageUrl: string, textHook: string, style: string): string => {
  if (!imageUrl) throw new Error('imageUrl is required')
  if (!textHook) throw new Error('textHook is required')

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) throw new Error('CLOUDINARY cloud name is not configured')

  const styleParams = getStyleParams(style)

  // Sanitize and limit text
  const safeText = String(textHook).slice(0, 180)

  // Build overlay transformation using SDK-friendly objects.
  // We avoid overly complex stroke or bo params to reduce fragile URL construction.
  const overlayLayer: any = {
    overlay: {
      font_family: styleParams.fontFamily || 'Arial',
      font_size: styleParams.fontSize,
      // Use bold weight if requested; else default
      font_weight: styleParams.fontWeight || undefined,
      text: safeText,
    },
    color: styleParams.color ? `#${styleParams.color.replace(/^#/, '')}` : undefined,
    gravity: 'center',
    y: -20,
    flags: 'layer_apply',
  }

  // Clean undefined keys
  const cleanedOverlay = Object.keys(overlayLayer).reduce((acc: any, key) => {
    const val = (overlayLayer as any)[key]
    if (val !== undefined) acc[key] = val
    return acc
  }, {})

  const transformation = [
    cleanedOverlay,
    {
      width: 1280,
      height: 720,
      crop: 'scale',
    },
    { fetch_format: 'auto' },
    { quality: 'auto' },
  ]

  // Use cloudinary.url to build a properly encoded fetch URL
  // `type: 'fetch'` tells Cloudinary to fetch the remote source URL (imageUrl)
  const generated = cloudinary.url(imageUrl, {
    type: 'fetch',
    resource_type: 'image',
    transformation,
  })

  return generated
}

const getStyleParams = (style: string) => {
  // Minimal safe style definitions — avoids stroke/border to reduce risk of malformed transforms.
  const styles: Record<string, { fontFamily?: string; fontSize: number; fontWeight?: string; color: string }> = {
    'bold-red': { fontFamily: 'Arial', fontSize: 80, fontWeight: 'bold', color: 'FF0000' },
    'neon-gradient': { fontFamily: 'Arial', fontSize: 90, fontWeight: 'bold', color: 'FFFF00' },
    'shadow-dark': { fontFamily: 'Arial', fontSize: 75, fontWeight: 'bold', color: 'FFFFFF' },
    'bright-yellow': { fontFamily: 'Arial', fontSize: 85, fontWeight: 'bold', color: 'FFFF00' },
  }

  return styles[style] || styles['bold-red']
}
