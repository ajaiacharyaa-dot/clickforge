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

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/fetch/${styleParams}/l_text:Arial_bold_${styleParams.fontSize}:${encodedText}/fl_layer_apply/c_scale,w_1280,h_720/${imageUrl}`
}

const getStyleParams = (style: string): Record<string, any> => {
  const styles: Record<string, Record<string, any>> = {
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
