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
 * Focused on thumbnail quality improvements:
 * - Mobile-first larger text
 * - Thick black stroke via an underlay text layer
 * - Subtle shadow via offset underlay
 * - Top/bottom positioning via gravity
 * - Keep text inside safe boundaries by scaling font size based on text length
 * - High contrast style colors
 * - Optional face-zoom crop
 * - Export at 1280x720
 */
export const addTextToImage = (imageUrl: string, textHook: string, style: string): string => {
  if (!imageUrl) throw new Error('imageUrl is required')
  if (!textHook) throw new Error('textHook is required')

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) throw new Error('CLOUDINARY cloud name is not configured')

  const styleParams = getStyleParams(style)

  // Sanitize and limit text length
  const safeText = String(textHook).trim().slice(0, 160)

  // Determine a safe single font family token (remove comma-separated fallbacks)
  const fontFamilySafe = (String(styleParams.fontFamily || 'Impact')).split(',')[0].trim()

  // Determine dynamic font size for mobile-first readability
  const base = styleParams.fontSize || 80
  const len = safeText.length
  let multiplier = 2.2
  if (len > 30) multiplier = 1.6
  if (len > 45) multiplier = 1.2
  const fontSize = Math.max(48, Math.round(base * multiplier))

  // Stroke and shadow sizes
  const strokeSize = Math.max(6, Math.round(fontSize * 0.12))
  const shadowOffset = Math.max(6, Math.round(fontSize * 0.05))

  // Positioning via gravity
  const gravity = styleParams.position === 'top' ? 'north' : 'south'
  const yOffset = styleParams.position === 'top' ? Math.round(fontSize * 0.35) : -Math.round(fontSize * 0.35)

  const transformations: any[] = []

  // Optional face-zoom crop (center on face then scale)
  if (styleParams.faceZoom) {
    transformations.push({ gravity: 'face', crop: 'thumb', width: 1280, height: 720 })
  }

  // Ensure final output is HD scale
  transformations.push({ width: 1280, height: 720, crop: 'scale' })

  // 1) Stroke layer: black text larger than main text
  transformations.push({
    overlay: {
      font_family: fontFamilySafe,
      font_size: fontSize + strokeSize,
      text: safeText,
    },
    color: '#000000',
    gravity,
    y: yOffset,
    flags: 'layer_apply',
  })

  // 2) Shadow layer: slightly offset for depth (we use black and offset; opacity control may require raw_transformation if needed)
  transformations.push({
    overlay: {
      font_family: fontFamilySafe,
      font_size: fontSize,
      text: safeText,
    },
    color: '#000000',
    gravity,
    y: yOffset + shadowOffset,
    flags: 'layer_apply',
  })

  // 3) Main text
  const textColor = String(styleParams.color || 'FFFFFF').replace(/^#/, '')
  transformations.push({
    overlay: {
      font_family: fontFamilySafe,
      font_size: fontSize,
      text: safeText,
    },
    color: `#${textColor}`,
    gravity,
    y: yOffset,
    flags: 'layer_apply',
  })

  // Finalize
  transformations.push({ fetch_format: 'auto' })
  transformations.push({ quality: 'auto' })

  const generated = cloudinary.url(imageUrl, {
    type: 'fetch',
    resource_type: 'image',
    transformation: transformations,
  })

  return generated
}

const getStyleParams = (style: string) => {
  const styles: Record<string, { fontFamily?: string; fontSize: number; fontWeight?: string; color: string; position?: 'top' | 'bottom'; faceZoom?: boolean }> = {
    'bold-red': { fontFamily: 'Impact,Arial', fontSize: 80, fontWeight: 'bold', color: 'FF2D2D', position: 'bottom', faceZoom: false },
    'neon-gradient': { fontFamily: 'Impact,Arial', fontSize: 80, fontWeight: 'bold', color: 'FFD44D', position: 'bottom', faceZoom: false },
    'shadow-dark': { fontFamily: 'Impact,Arial', fontSize: 75, fontWeight: 'bold', color: 'FFFFFF', position: 'top', faceZoom: false },
    'bright-yellow': { fontFamily: 'Impact,Arial', fontSize: 85, fontWeight: 'bold', color: 'FFD400', position: 'bottom', faceZoom: true },
  }

  return styles[style] || styles['bold-red']
}
