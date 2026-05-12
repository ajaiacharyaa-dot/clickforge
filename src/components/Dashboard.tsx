'use client'

import React, { useState } from 'react'
import { ImageUpload } from './ImageUpload'
import { TitleInput } from './TitleInput'
import { HookSuggestions } from './HookSuggestions'
import { ThumbnailPreview } from './ThumbnailPreview'
import { CTRScore } from './CTRScore'

interface Variation {
  variant_number: number
  text_hook: string
  style_applied: string
  image_url: string
  ctr_score?: number
}

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export const Dashboard: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [videoTitle, setVideoTitle] = useState<string>('')
  const [hooks, setHooks] = useState<string[]>([])
  const [selectedHooks, setSelectedHooks] = useState<string[]>([])
  const [variations, setVariations] = useState<Variation[]>([])
  const [ctrScores, setCtrScores] = useState<Record<number, any>>({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type }
    setToasts((prev) => [...prev, toast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  // Step 1: Generate hooks
  const handleGenerateHooks = async () => {
    if (!videoTitle.trim()) {
      showToast('Please enter a video title', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoTitle }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.data.hooks.length > 0) {
        setHooks(data.data.hooks)
        setStep(2)
        showToast('✨ Text hooks generated!', 'success')
      } else {
        showToast('Failed to generate hooks. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error generating hooks:', error)
      showToast('Failed to generate hooks. Check your API keys.', 'error')
      // Fallback hooks for testing
      setHooks([
        'YOU WONT BELIEVE',
        'SHOCKING TRUTH',
        'INSANE RESULTS',
        'FINALLY EXPOSED',
        'MUST WATCH',
      ])
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Select hooks and generate thumbnails
  const handleGenerateThumbnails = async () => {
    if (selectedHooks.length !== 3) {
      showToast('Please select exactly 3 hooks', 'error')
      return
    }

    if (!imageUrl) {
      showToast('Please upload an image first', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          hooks: selectedHooks,
          styles: ['bold-red', 'neon-gradient', 'shadow-dark'],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.data.variations.length > 0) {
        setVariations(data.data.variations)
        showToast('🎨 Thumbnails generated!', 'success')

        // Calculate CTR scores for each variation
        const scores: Record<number, any> = {}
        for (const variation of data.data.variations) {
          try {
            const scoreResponse = await fetch('/api/calculate-ctr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: variation.text_hook,
                style: variation.style_applied,
              }),
            })

            if (scoreResponse.ok) {
              const scoreData = await scoreResponse.json()
              if (scoreData.success) {
                scores[variation.variant_number] = scoreData.data
              }
            }
          } catch (err) {
            console.error('Error calculating CTR score:', err)
          }
        }
        setCtrScores(scores)
        setStep(3)
      } else {
        showToast('Failed to generate thumbnails', 'error')
      }
    } catch (error) {
      console.error('Error generating thumbnails:', error)
      showToast('Failed to generate thumbnails. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setImageUrl('')
    setVideoTitle('')
    setHooks([])
    setSelectedHooks([])
    setVariations([])
    setCtrScores({})
    showToast('Ready to create a new thumbnail!', 'info')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            🎬 ClickForge
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered YouTube thumbnail generator optimized for CTR
          </p>
        </div>

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-pulse ${
                toast.type === 'success'
                  ? 'bg-green-500'
                  : toast.type === 'error'
                  ? 'bg-red-500'
                  : 'bg-blue-500'
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mb-8 flex justify-center gap-3">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                step >= num
                  ? 'bg-primary text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-6">Step 1: Upload & Configure</h2>
              </div>

              <ImageUpload onImageUpload={setImageUrl} isLoading={loading} />

              <TitleInput value={videoTitle} onChange={setVideoTitle} />

              <button
                onClick={handleGenerateHooks}
                disabled={loading || !imageUrl || !videoTitle.trim()}
                className="w-full bg-gradient-viral text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Text Hooks →'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Step 2: Select Hooks</h2>
                <p className="text-gray-600">Choose 3 text hooks for your variations</p>
              </div>

              <HookSuggestions
                hooks={hooks}
                selectedHooks={selectedHooks}
                onSelectHook={(hook) => {
                  if (selectedHooks.includes(hook)) {
                    setSelectedHooks(selectedHooks.filter((h) => h !== hook))
                  } else if (selectedHooks.length < 3) {
                    setSelectedHooks([...selectedHooks, hook])
                  }
                }}
                isLoading={loading}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep(1)
                    setSelectedHooks([])
                  }}
                  disabled={loading}
                  className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
                >
                  ← Back
                </button>
                <button
                  onClick={handleGenerateThumbnails}
                  disabled={loading || selectedHooks.length !== 3}
                  className="flex-1 bg-gradient-viral text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Thumbnails →'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Step 3: Preview & Score</h2>
                <p className="text-gray-600">View your generated thumbnails with CTR scores</p>
              </div>

              <ThumbnailPreview variations={variations} />

              {/* CTR Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variations.map((variation) => (
                  <div key={variation.variant_number}>
                    {ctrScores[variation.variant_number] ? (
                      <CTRScore
                        score={ctrScores[variation.variant_number].ctrScore}
                        factors={ctrScores[variation.variant_number].factors}
                        textHook={variation.text_hook}
                      />
                    ) : (
                      <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                        Calculating score...
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-gradient-viral text-white font-bold py-3 rounded-lg hover:opacity-90 transition"
              >
                ✨ Create Another
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>© 2026 ClickForge. Powered by AI.</p>
        </div>
      </div>
    </div>
  )
}
