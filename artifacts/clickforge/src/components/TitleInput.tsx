'use client'

import React from 'react'

interface TitleInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const TitleInput: React.FC<TitleInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter your video title...',
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Video Title
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={200}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
      />
      <p className="text-xs text-gray-500 mt-1">{value.length}/200</p>
    </div>
  )
}
