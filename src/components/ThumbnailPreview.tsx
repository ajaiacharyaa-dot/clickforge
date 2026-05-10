'use client'

import React, { useState } from 'react'
import Image from 'next/image'
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

export const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  variations,
  onStyleChange,
}) => {
  const [selectedVariant, setSelectedVariant] = useState(0)

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Generated Thumbnails
      </label>

      {variations.length > 0 ? (
        <div className="space-y-6">
          {/* Main display */}
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video relative">
            <Image
              src={variations[selectedVariant].image_url}
              alt={`Variant ${selectedVariant + 1}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Variant tabs */}
          <div className="grid grid-cols-3 gap-3">
            {variations.map((variation, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(index)}
                className={`p-2 rounded-lg border-2 transition ${
                  selectedVariant === index
                    ? 'border-primary'
                    : 'border-gray-200'
                }`}
              >
                <div className="relative w-full aspect-video mb-2 bg-gray-100 rounded">
                  <Image
                    src={variation.image_url}
                    alt={`Variant ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs font-semibold">V{index + 1}</p>
                <p className="text-xs text-gray-600 truncate">
                  {variation.text_hook}
                </p>
              </button>
            ))}
          </div>

          {/* Style selector for current variant */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Current Style: {variations[selectedVariant].style_applied}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {viralStyles.map((style) => (
                <button
                  key={style.name}
                  onClick={() =>
                    onStyleChange?.(
                      variations[selectedVariant].variant_number,
                      style.name
                    )
                  }
                  className={`p-2 rounded border-2 text-sm font-semibold transition ${
                    variations[selectedVariant].style_applied === style.name
                      ? 'border-primary bg-orange-50'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  {style.icon} {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">Upload image and select hooks to generate thumbnails</p>
        </div>
      )}
    </div>
  )
}
