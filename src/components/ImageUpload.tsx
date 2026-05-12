'use client'

import React, { useState, useCallback } from 'react'
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
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      setError(null)

      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary in background
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        const data = await response.json()
        if (data.success && data.data?.imageUrl) {
          onImageUpload(data.data.imageUrl)
          setError(null)
        } else {
          setError('Upload failed. Please try again.')
        }
      } catch (err) {
        console.error('Upload error:', err)
        setError('Failed to upload image. Please try again.')
      } finally {
        setUploading(false)
      }
    },
    [onImageUpload]
  )

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Upload Image
      </label>

      <div className="relative w-full border-2 border-dashed border-primary rounded-lg p-4 sm:p-8 text-center hover:border-accent transition bg-white">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || isLoading}
          className="hidden"
          id="image-upload"
          aria-label="Upload image"
        />

        <label htmlFor="image-upload" className="block cursor-pointer">
          {preview ? (
            <div className="space-y-3">
              <div className="relative w-full h-48 sm:h-64 mx-auto">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                {uploading ? '⏳ Uploading...' : '✅ Image ready! Click to change'}
              </p>
            </div>
          ) : (
            <div className="py-4 sm:py-8">
              <p className="text-3xl sm:text-4xl mb-2">📸</p>
              <p className="text-sm sm:text-base text-gray-700 font-semibold">
                {uploading ? '⏳ Uploading...' : 'Click to upload'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                or drag & drop
              </p>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
            </div>
          )}
        </label>

        {uploading && (
          <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center pointer-events-none">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
