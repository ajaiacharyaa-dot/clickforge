'use client'

import React, { useState } from 'react'

interface HookSuggestionsProps {
  hooks: string[]
  selectedHooks: string[]
  onSelectHook: (hook: string) => void
  isLoading?: boolean
}

export const HookSuggestions: React.FC<HookSuggestionsProps> = ({
  hooks,
  selectedHooks,
  onSelectHook,
  isLoading = false,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Text Hooks (Select up to 3)
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {hooks.map((hook, index) => (
          <button
            key={index}
            onClick={() => onSelectHook(hook)}
            disabled={isLoading}
            className={`p-3 rounded-lg border-2 transition text-left ${
              selectedHooks.includes(hook)
                ? 'border-primary bg-orange-50'
                : 'border-gray-200 hover:border-primary'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <p className="font-semibold text-sm">{hook}</p>
            <p className="text-xs text-gray-500 mt-1">Viral Score: 8.5/10</p>
          </button>
        ))}
      </div>
    </div>
  )
}
