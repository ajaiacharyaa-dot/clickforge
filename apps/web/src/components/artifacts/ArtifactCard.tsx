'use client'

import React from 'react'

export const ArtifactCard: React.FC<{ artifact: any }> = ({ artifact }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-3">
      <div className="w-full aspect-video bg-gray-100 rounded overflow-hidden mb-3">
        {artifact.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artifact.previewUrl} alt={artifact.name} className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">No preview</div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{artifact.name || 'Untitled'}</div>
          <div className="text-xs text-gray-400">{artifact.type}</div>
        </div>
        <div className="text-right">
          {artifact.metadata?.ctrScore != null && (
            <div className="text-sm font-bold text-green-400">{artifact.metadata.ctrScore}</div>
          )}
        </div>
      </div>
      <div className="mt-3 flex space-x-2">
        {artifact.previewUrl && (
          <a href={artifact.previewUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-slate-700 rounded text-sm">Preview</a>
        )}
        {artifact.previewUrl && (
          <a href={artifact.previewUrl} download className="px-3 py-1 bg-slate-700 rounded text-sm">Download</a>
        )}
      </div>
    </div>
  )
}

export default ArtifactCard
