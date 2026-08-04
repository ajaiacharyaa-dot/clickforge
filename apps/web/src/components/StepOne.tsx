'use client'

import React, { useRef, useState } from 'react'

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

  const openFilePicker = () => inputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Immediate preview
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload to server (Cloudinary)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!resp.ok) {
        console.error('upload response not ok', resp.status)
        alert('Upload failed. Please try again.')
        return
      }

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

  const handleGenerateClick = () => {
    if (!localTitle.trim()) {
      alert('Please enter a video title')
      return
    }
    if (!preview) {
      alert('Please upload an image first')
      return
    }

    onGenerate(localTitle.trim(), preview)
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="rounded-lg border-2 border-dashed border-primary p-4 flex flex-col items-center justify-center touch-manipulation">
          <input type="file" accept="image/*" ref={inputRef} onChange={handleFileChange} className="hidden" id="stepone-upload" />
          {preview ? (
            <div className="w-full max-w-md mx-auto relative aspect-video rounded overflow-hidden bg-gray-100">
              {/* Use native <img> not next/image for local data URLs and complex fetch URLs */}
              <img src={preview} alt="Preview" className="object-cover w-full h-full" draggable={false} />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">📸</p>
              <p className="font-semibold text-gray-700">Upload a base image</p>
              <p className="text-sm text-gray-500">PNG or JPG, up to 10MB</p>
            </div>
          )}

          <div className="mt-3 flex w-full max-w-md gap-2">
            <button type="button" onClick={openFilePicker} className="flex-1 bg-primary text-white font-bold py-3 rounded-lg">
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <button type="button" onClick={handleGenerateClick} className="flex-1 bg-gradient-viral text-white font-bold py-3 rounded-lg" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Hooks'}
            </button>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <label className="block text-sm font-semibold mb-2">Video Title</label>
          <input value={localTitle} onChange={(e) => setLocalTitle(e.target.value)} className="w-full rounded-md p-3 border" placeholder="Enter your video title" />
        </div>
      </div>
    </div>
  )
}
