import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * Upload image to Cloudinary.
 * - If CLOUDINARY_API_KEY & CLOUDINARY_API_SECRET are present, perform a signed server-side upload via the SDK.
 * - Otherwise fall back to unsigned upload using the named upload preset `clickforge_thumbnails`.
 *
 * Returns: secure_url string on success, throws on failure.
 */
export const uploadImage = async (file: File): Promise<string> => {
  // If SDK credentials available, use uploader.upload_stream (server-side) for stability.
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

  // Fallback: unsigned upload via fetch to Cloudinary unsigned preset
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured')
  }

  try {
    const formData = new FormData()
    formData.append('file', file as any)
    formData.append('upload_preset', 'clickforge_thumbnails')

    const resp = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

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
 * For stability we:
 * - Validate inputs
 * - URL-encode the source image
 * - Limit overlay text length
 * - Use well-formed Cloudinary transformation segments
 *
 * Note: This returns a fetch URL that Cloudinary will resolve on-demand.
 */
export const addTextToImage = (
  imageUrl: string,
  textHook: string,
  style: string
): string => {
  if (!imageUrl) throw new Error('imageUrl is required')
  if (!textHook) throw new Error('textHook is required')

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) throw new Error('CLOUDINARY cloud name is not configured')

  const styleParams = getStyleParams(style)

  // Limit and sanitize text
  const safeText = String(textHook).slice(0, 200)
  const encodedText = encodeURIComponent(safeText)

  // Build overlay text; choose a generic web-safe font family + size. Cloudinary supports `Arial` fallback.
  // Format: l_text:Arial_bold_72:Hello%20World
  const overlay = `l_text:Arial_bold_${styleParams.fontSize}:${encodedText}`

  // Border / stroke param
  const bo = `bo_${styleParams.strokeWidth}px_solid_rgb:${styleParams.strokeColor}`

  // Color param
  const co = `co_rgb:${styleParams.color}`

  // Positioning & layer apply flags
  const position = ['g_center', 'y_-20', 'fl_layer_apply']

  // Final transformations (order matters)
  const transformationParts = [
    overlay,
    bo,
    co,
    ...position,
    'c_scale',
    'w_1280',
    'h_720',
    'f_auto',
    'q_auto',
  ]

  // Join with commas and ensure transformation string is safe in a URL path segment
  const transformation = transformationParts.join(',')

  const encodedSource = encodeURIComponent(imageUrl)

  // Return a Cloudinary fetch URL
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformation}/${encodedSource}`
}

const getStyleParams = (style: string) => {
  const styles: Record<
    string,
    { fontSize: number; color: string; strokeColor: string; strokeWidth: number }
  > = {
    'bold-red': { fontSize: 80, color: 'FF0000', strokeColor: 'FFFFFF', strokeWidth: 3 },
    'neon-gradient': { fontSize: 90, color: 'FFFF00', strokeColor: '00FFFF', strokeWidth: 2 },
    'shadow-dark': { fontSize: 75, color: 'FFFFFF', strokeColor: '000000', strokeWidth: 5 },
    'bright-yellow': { fontSize: 85, color: 'FFFF00', strokeColor: '000000', strokeWidth: 3 },
  }

  return styles[style] || styles['bold-red']
}
