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
    throw new Error('Failed to upload image to Cloudinary')
  }
}

export const addTextToImage = (imageUrl: string, textHook: string, style: string): string => {
  const encodedText = encodeURIComponent(textHook)
  const styleParams = getStyleParams(style)

  // Build Cloudinary transformation URL with proper parameter formatting
  const textLayer = `text:Arial_bold_${styleParams.fontSize}_${styleParams.color}:${encodedText}`
  const transformations = [
    {
      overlay: textLayer,
      gravity: 'center',
      y: 0,
      color: styleParams.color,
      stroke: `solid_${styleParams.strokeWidth}_${styleParams.strokeColor}`,
      width: 1200,
      crop: 'fit',
    },
    {
      crop: 'scale',
      width: 1280,
      height: 720,
    },
  ]

  // Use Cloudinary SDK or build manual URL with fetch parameter
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/fetch/l_text:Arial_bold_${styleParams.fontSize}_${styleParams.color}:${encodedText},g_center,y_0,co_${styleParams.color},b_solid_${styleParams.strokeWidth}_${styleParams.strokeColor},w_1200,c_fit/c_scale,w_1280,h_720,ar_16:9,c_fill/${imageUrl}`

  return cloudinaryUrl
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
