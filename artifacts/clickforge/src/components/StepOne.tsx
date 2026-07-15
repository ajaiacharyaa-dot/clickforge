import React, { useRef, useState } from 'react'

interface StepOneProps {
  onUpload?: (imageUrl: string) => void
  onGenerate: (videoTitle: string, imageUrl: string) => void
  initialTitle?: string
  initialImageUrl?: string
  isLoading?: boolean
}

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? ''

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
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(initialImageUrl || null)

  const openFilePicker = () => inputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Immediate preview from local data URL
    const reader = new FileReader()
    reader.onloadend = () => {
      const localDataUrl = reader.result as string
      setPreview(localDataUrl)
      setUploadedUrl(localDataUrl)
      onUpload?.(localDataUrl)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary via API
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const resp = await fetch(`${BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      })

      if (resp.ok) {
        const data = await resp.json()
        if (data?.success && data.data?.imageUrl) {
          setUploadedUrl(data.data.imageUrl)
          setPreview(data.data.imageUrl)
          onUpload?.(data.data.imageUrl)
        }
      }
    } catch (err) {
      // Keep local data URL on error — already set above
      console.warn('Upload to Cloudinary failed, using local preview:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleGenerateClick = () => {
    if (!localTitle.trim()) {
      alert('Please enter a video title')
      return
    }
    if (!uploadedUrl) {
      alert('Please upload an image first')
      return
    }

    onGenerate(localTitle.trim(), uploadedUrl)
  }

  return (
    <div className="w-full space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 1: Upload Image & Title</h2>
        <p className="text-gray-600">Upload your base image and enter your video title</p>
      </div>

      <div className="rounded-lg border-2 border-dashed border-primary p-4 flex flex-col items-center justify-center bg-white">
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          id="stepone-upload"
        />

        {preview ? (
          <div className="w-full max-w-md mx-auto relative aspect-video rounded overflow-hidden bg-gray-100">
            <img src={preview} alt="Preview" className="object-cover w-full h-full" draggable={false} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-2xl mb-2">📸</p>
            <p className="font-semibold text-gray-700">Upload a base image</p>
            <p className="text-sm text-gray-500">PNG or JPG, up to 10MB</p>
          </div>
        )}

        <div className="mt-3 w-full max-w-md">
          <button
            type="button"
            onClick={openFilePicker}
            disabled={uploading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {uploading ? '⏳ Uploading...' : preview ? '🔄 Change Image' : '📷 Upload Image'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Video Title</label>
        <input
          type="text"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          placeholder="e.g. I Tried This Challenge for 30 Days"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
          onKeyDown={(e) => { if (e.key === 'Enter') handleGenerateClick() }}
        />
      </div>

      <button
        onClick={handleGenerateClick}
        disabled={isLoading || uploading || !uploadedUrl || !localTitle.trim()}
        className="w-full bg-gradient-viral text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '✨ Generating hooks...' : '✨ Generate Hooks →'}
      </button>
    </div>
  )
}
