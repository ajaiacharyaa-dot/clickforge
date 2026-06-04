'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'

interface StepOneProps {
  onUpload: (imageUrl: string) => void
  onGenerate: (videoTitle: string, imageUrl: string) => void
  initialTitle?: string
  initialImageUrl?: string
  isLoading?: boolean
}

export const StepOne: React.FC<StepOneProps> = ({
  onUpload,
  onGenerate,
  initialTitle = '',
  initialImageUrl = '',
  isLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [localTitle, setLocalTitle] = useState<string>(initialTitle)
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null)
  const [uploading, setUploading] = useState(false)

  // Trigger the native file picker
  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show immediate local preview for mobile responsiveness
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload to server (Cloudinary) and notify parent
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await resp.json()
      if (data?.success && data.data?.imageUrl) {
        onUpload(data.data.imageUrl)
        setPreview(data.data.imageUrl)
      } else {
        console.error('Upload response invalid', data)
        alert('Upload failed. Please try again.')
      }
    } catch (err) {
      console.error('Upload error', err)
      alert('Upload failed. Please check your connection and try again.')
    } finally {
      setUploading(false)
    }
  }

  // Generate button handler - we do NOT rely on the HTML disabled attribute to avoid mobile click issues
  const handleGenerateClick = () => {
    // Ensure both title and image exist before calling parent
    if (!localTitle.trim()) {
      alert('Please enter a video title')
      return
    }
    if (!preview) {
      alert('Please upload an image first')
      return
    }

    // Call parent with the title and image URL
    onGenerate(localTitle.trim(), preview)
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Image preview and upload action */}
        <div className="rounded-lg border-2 border-dashed border-primary p-4 flex flex-col items-center justify-center touch-manipulation">
          {preview ? (
            <div className="w-full max-w-md mx-auto relative aspect-video rounded overflow-hidden bg-gray-100">
              <Image src={preview} alt="Preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">📸</p>
              <p className="font-semibold text-gray-700">Upload a base image</p>
              <p className="text-sm text-gray-500">PNG or JPG, up to 10MB</p>
            </div>
          )}

          <div className="mt-3 flex w-full max-w-md gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden
            />

            <button
              type="button"
              onClick={openFilePicker}
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-semibold touch-manipulation"
              aria-label="Upload image"
            >
              {uploading ? 'Uploading…' : preview ? 'Replace Image' : 'Upload Image'}
            </button>

            <button
              type="button"
              onClick={() => {
                setPreview(null)
                // also clear the underlying input file value so the same file can be reselected
                if (inputRef.current) inputRef.current.value = ''
              }}
              className="px-3 py-3 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Title input */}
        <div className="w-full max-w-md mx-auto">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Video Title</label>
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            placeholder="Enter your video title..."
            maxLength={200}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            inputMode="text"
          />
          <p className="text-xs text-gray-500 mt-1">{localTitle.length}/200</p>
        </div>

        {/* Generate button - always responsive on mobile */}
        <div className="w-full max-w-md mx-auto">
          <button
            type="button"
            onClick={handleGenerateClick}
            className="w-full bg-gradient-viral text-white font-bold py-3 rounded-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/30 text-sm"
          >
            {isLoading ? 'Generating…' : 'Generate Text Hooks →'}
          </button>
        </div>
      </div>
    </div>
  )
}
