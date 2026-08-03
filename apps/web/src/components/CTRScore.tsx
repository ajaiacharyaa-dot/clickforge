'use client'

import React from 'react'

interface CTRFactors {
  textImpact: number
  styleImpact: number
  contrast: number
  emotionalTrigger: number
}

interface CTRScoreProps {
  score: number
  factors: CTRFactors
  textHook: string
}

export const CTRScore: React.FC<CTRScoreProps> = ({ score, factors, textHook }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className={`rounded-lg border-2 p-4 ${getScoreBg(score)}`}>
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-700 mb-1">Text Hook</p>
        <p className="font-bold text-lg">{textHook}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">CTR Score</p>
          <p className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}/100</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-700">Text Impact:</span>
          <span className="font-semibold">{factors.textImpact.toFixed(0)}/100</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Style Impact:</span>
          <span className="font-semibold">{factors.styleImpact.toFixed(0)}/100</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Contrast:</span>
          <span className="font-semibold">{factors.contrast.toFixed(1)}/10</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Emotional Trigger:</span>
          <span className="font-semibold">{factors.emotionalTrigger.toFixed(1)}/10</span>
        </div>
      </div>
    </div>
  )
}
