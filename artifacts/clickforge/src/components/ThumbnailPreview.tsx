import React, { useState } from 'react'
import { viralStyles } from '@/lib/hooks'

interface Variation {
  variant_number: number
  text_hook: string
  style_applied: string
  image_url: string
}

interface ThumbnailPreviewProps {
  variations: Variation[]
  onStyleChange?: (variantNumber: number, style: string) => void
}

export const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ variations, onStyleChange }) => {
  const [selectedVariant, setSelectedVariant] = useState(0)

  if (!variations || variations.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">Upload image and select hooks to generate thumbnails</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Large preview */}
      <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
        <img
          src={variations[selectedVariant]?.image_url}
          alt={`Thumbnail variant ${selectedVariant + 1}`}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <span>Hook:</span>
        <span className="text-primary">{variations[selectedVariant]?.text_hook}</span>
      </div>

      {/* Variant thumbnails */}
      <div className="grid grid-cols-3 gap-2">
        {variations.map((variation, index) => (
          <button
            key={index}
            onClick={() => setSelectedVariant(index)}
            className={`p-2 rounded-lg border-2 transition ${
              selectedVariant === index ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-primary'
            }`}
          >
            <div className="w-full aspect-video mb-2 bg-gray-100 rounded overflow-hidden">
              <img
                src={variation.image_url}
                alt={`Variant ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-xs font-semibold">V{index + 1}</p>
            <p className="text-xs text-gray-600 truncate">{variation.text_hook}</p>
          </button>
        ))}
      </div>

      {/* Style switcher */}
      {onStyleChange && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Current Style: {variations[selectedVariant]?.style_applied}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {viralStyles.map((style) => (
              <button
                key={style.name}
                onClick={() => onStyleChange(variations[selectedVariant].variant_number, style.name)}
                className={`p-2 rounded border-2 text-sm font-semibold transition ${
                  variations[selectedVariant]?.style_applied === style.name
                    ? 'border-primary bg-orange-50'
                    : 'border-gray-200 hover:border-primary'
                }`}
              >
                {style.icon} {style.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
