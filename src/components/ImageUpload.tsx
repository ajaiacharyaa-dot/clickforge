'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  isLoading?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  isLoading = false,
}) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        onImageUpload(data.data.imageUrl)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center hover:border-accent transition">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || isLoading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer block"
        >
          {preview ? (
            <div className="relative w-full h-64">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div>
              <p className="text-2xl mb-2">📸</p>
              <p className="text-gray-700 font-semibold">
                {uploading ? 'Uploading...' : 'Click to upload or drag & drop'}
              </p>
              <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
            </div>
          )}
        </label>
      </div>
    </div>
  )
}
