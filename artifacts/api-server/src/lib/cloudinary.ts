import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export const uploadImageBuffer = async (buffer: Buffer, filename: string): Promise<string> => {
  // If no Cloudinary credentials, return a data URL placeholder
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    // Return as base64 data URL fallback
    const base64 = buffer.toString('base64')
    const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg'
    return `data:${mimeType};base64,${base64}`
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'clickforge',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    ).end(buffer)
  })
}

export const addTextToImage = (imageUrl: string, text: string, style: string): string => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // No Cloudinary config — return original URL
    return imageUrl
  }

  const safeText = text.replace(/[<>{}|\\^~\[\]`]/g, '').slice(0, 80)
  const styleParams = getStyleParams(style)
  const fontSize = styleParams.fontSize
  const fontFamilySafe = styleParams.fontFamily || 'Impact'
  const position = styleParams.position || 'bottom'
  const yMain = position === 'top' ? 50 : -50
  const shadowOffset = 4

  const transformations: Record<string, any>[] = []

  // Shadow layer
  transformations.push({
    overlay: {
      font_family: fontFamilySafe,
      font_size: fontSize,
      text: safeText,
    },
    color: '#000000',
    gravity: position,
    y: yMain + shadowOffset,
    flags: 'layer_apply',
  })

  // Main text layer
  const colorHex = String(styleParams.color || 'FFFFFF').replace(/^#/, '')
  transformations.push({
    overlay: {
      font_family: fontFamilySafe,
      font_size: fontSize,
      text: safeText,
    },
    color: `#${colorHex}`,
    gravity: position,
    y: yMain,
    flags: 'layer_apply',
  })

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
  const styles: Record<string, { fontFamily?: string; fontSize: number; color: string; position?: 'top' | 'bottom' }> = {
    'bold-red': { fontFamily: 'Impact', fontSize: 80, color: 'FF2D2D', position: 'bottom' },
    'neon-gradient': { fontFamily: 'Impact', fontSize: 80, color: 'FFD44D', position: 'bottom' },
    'shadow-dark': { fontFamily: 'Impact', fontSize: 75, color: 'FFFFFF', position: 'top' },
    'bright-yellow': { fontFamily: 'Impact', fontSize: 85, color: 'FFD400', position: 'bottom' },
  }
  return styles[style] || styles['bold-red']
}
