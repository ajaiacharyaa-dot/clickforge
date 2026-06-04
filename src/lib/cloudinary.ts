import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'clickforge_thumbnails')

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

export const addTextToImage = (
  imageUrl: string,
  textHook: string,
  style: string
): string => {
  const styleParams = getStyleParams(style)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    throw new Error('CLOUDINARY cloud name is not configured')
  }

  // Encode text for URL safely
  const encodedText = encodeURIComponent(textHook).substring(0, 250)

  // Build Cloudinary transformation string
  const transformation = [
    `l_text:Arial_bold_${styleParams.fontSize}:${encodedText}`,
    // stroke / border is applied via outline / stroke params in Cloudinary transformations
    `bo_${styleParams.strokeWidth}px_solid_rgb:${styleParams.strokeColor}`,
    `co_rgb:${styleParams.color}`,
    'g_center',
    'y_-20',
    'fl_layer_apply',
    'c_scale',
    'w_1280',
    'h_720',
    'f_auto',
    'q_auto',
  ].join(',')

  // Encode the source image URL to avoid malformed fetch URLs
  const encodedImageUrl = encodeURIComponent(imageUrl)

  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformation}/${encodedImageUrl}`
}

const getStyleParams = (
  style: string
): {
  fontSize: number
  color: string
  strokeColor: string
  strokeWidth: number
} => {
  const styles: Record<
    string,
    {
      fontSize: number
      color: string
      strokeColor: string
      strokeWidth: number
    }
  > = {
    'bold-red': {
      fontSize: 80,
      color: 'FF0000',
      strokeColor: 'FFFFFF',
      strokeWidth: 3,
    },
    'neon-gradient': {
      fontSize: 90,
      color: 'FFFF00',
      strokeColor: '00FFFF',
      strokeWidth: 2,
    },
    'shadow-dark': {
      fontSize: 75,
      color: 'FFFFFF',
      strokeColor: '000000',
      strokeWidth: 5,
    },
    'bright-yellow': {
      fontSize: 85,
      color: 'FFFF00',
      strokeColor: '000000',
      strokeWidth: 3,
    },
  }

  return styles[style] || styles['bold-red']
}
