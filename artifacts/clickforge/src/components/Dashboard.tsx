import React, { useState } from 'react'
import { HookSuggestions } from './HookSuggestions'
import { ThumbnailPreview } from './ThumbnailPreview'
import { CTRScore } from './CTRScore'
import { StepOne } from './StepOne'

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

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? ''

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

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const generateHooks = async (title: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE}/api/generate-hooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoTitle: title }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (data.success && data.data.hooks.length > 0) {
        setHooks(data.data.hooks)
        setStep(2)
        showToast('✨ Text hooks generated!', 'success')
      } else {
        throw new Error('No hooks returned')
      }
    } catch (err) {
      console.error('generateHooks error:', err)
      showToast('Failed to generate hooks. Using fallback suggestions.', 'error')
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

  const handleGenerateFromStepOne = async (title: string, imgUrl: string) => {
    setVideoTitle(title)
    setImageUrl(imgUrl)
    await generateHooks(title)
  }

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
      const response = await fetch(`${BASE}/api/generate-thumbnail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          hooks: selectedHooks,
          styles: ['bold-red', 'neon-gradient', 'shadow-dark'],
        }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (data.success && data.data.variations.length > 0) {
        setVariations(data.data.variations)
        showToast('🎨 Thumbnails generated!', 'success')

        const scores: Record<number, any> = {}
        for (const variation of data.data.variations) {
          try {
            const scoreResponse = await fetch(`${BASE}/api/calculate-ctr`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: variation.text_hook, style: variation.style_applied }),
            })
            if (scoreResponse.ok) {
              const scoreData = await scoreResponse.json()
              if (scoreData.success) {
                scores[variation.variant_number] = scoreData.data
              }
            }
          } catch (e) {
            console.error('CTR score error:', e)
          }
        }
        setCtrScores(scores)
      } else {
        throw new Error('No variations returned')
      }
    } catch (err) {
      console.error('generateThumbnails error:', err)
      showToast('Failed to generate thumbnails', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setHooks([])
    setSelectedHooks([])
    setVariations([])
    setCtrScores({})
    setImageUrl('')
    setVideoTitle('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
              toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-viral text-white py-6 px-4 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">🎬 ClickForge</h1>
          <p className="text-sm sm:text-base opacity-90">AI-Powered YouTube Thumbnail Generator</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            {[
              { n: 1, label: 'Upload & Title' },
              { n: 2, label: 'Select Hooks' },
              { n: 3, label: 'Preview & Score' },
            ].map(({ n, label }) => (
              <React.Fragment key={n}>
                <div
                  className={`flex items-center gap-1.5 font-semibold ${
                    step === n ? 'text-primary' : step > n ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === n
                        ? 'bg-primary text-white'
                        : step > n
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > n ? '✓' : n}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {n < 3 && <div className="flex-1 h-0.5 bg-gray-200 mx-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {step === 1 && (
            <StepOne onGenerate={handleGenerateFromStepOne} isLoading={loading} />
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Step 2: Select Hooks</h2>
                <p className="text-gray-600">Select exactly 3 hooks for your thumbnail variations</p>
                <p className="text-sm font-medium text-primary mt-1">
                  Selected: {selectedHooks.length}/3
                </p>
              </div>

              <HookSuggestions
                hooks={hooks}
                selectedHooks={selectedHooks}
                onSelectHook={(hook) => {
                  if (selectedHooks.includes(hook)) setSelectedHooks(selectedHooks.filter((h) => h !== hook))
                  else if (selectedHooks.length < 3) setSelectedHooks([...selectedHooks, hook])
                }}
                isLoading={loading}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep(1); setSelectedHooks([]) }}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
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

        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2026 ClickForge. Powered by AI.</p>
        </div>
      </div>
    </div>
  )
}
