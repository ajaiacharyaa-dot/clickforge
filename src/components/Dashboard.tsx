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

export const Dashboard: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [videoTitle, setVideoTitle] = useState<string>('')
  const [hooks, setHooks] = useState<string[]>([])
  const [selectedHooks, setSelectedHooks] = useState<string[]>([])
  const [variations, setVariations] = useState<Variation[]>([])
  const [ctrScores, setCtrScores] = useState<Record<number, any>>({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  // Step 1: Generate hooks
  const handleGenerateHooks = async () => {
    if (!videoTitle.trim()) {
      alert('Please enter a video title')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoTitle }),
      })

      const data = await response.json()
      if (data.success) {
        setHooks(data.data.hooks)
        setStep(2)
      }
    } catch (error) {
      alert('Failed to generate hooks')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Select hooks and generate thumbnails
  const handleGenerateThumbnails = async () => {
    if (selectedHooks.length !== 3) {
      alert('Please select exactly 3 hooks')
      return
    }

    if (!imageUrl) {
      alert('Please upload an image first')
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

      const data = await response.json()
      if (data.success) {
        setVariations(data.data.variations)

        // Calculate CTR scores for each variation
        const scores: Record<number, any> = {}
        for (const variation of data.data.variations) {
          const scoreResponse = await fetch('/api/calculate-ctr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: variation.text_hook,
              style: variation.style_applied,
            }),
          })

          const scoreData = await scoreResponse.json()
          if (scoreData.success) {
            scores[variation.variant_number] = scoreData.data
          }
        }
        setCtrScores(scores)
        setStep(3)
      }
    } catch (error) {
      alert('Failed to generate thumbnails')
    } finally {
      setLoading(false)
    }
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
                  className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
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
                    {ctrScores[variation.variant_number] && (
                      <CTRScore
                        score={ctrScores[variation.variant_number].ctrScore}
                        factors={ctrScores[variation.variant_number].factors}
                        textHook={variation.text_hook}
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setStep(1)
                  setImageUrl('')
                  setVideoTitle('')
                  setHooks([])
                  setSelectedHooks([])
                  setVariations([])
                  setCtrScores({})
                }}
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
