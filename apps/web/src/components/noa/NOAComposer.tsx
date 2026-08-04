'use client'

import React from 'react'

export default function NOAComposer({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <input
          placeholder="Ask NOA to build something..."
          className="flex-1 px-4 py-3 rounded bg-slate-900 border border-slate-700 text-white"
        />
        <button className="px-4 py-2 bg-indigo-600 rounded" onClick={() => onAction('run')}>Run</button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onAction('thumbnail')} className="px-3 py-1 bg-slate-700 rounded">Thumbnail</button>
        <button onClick={() => onAction('content')} className="px-3 py-1 bg-slate-700 rounded">Content</button>
        <button onClick={() => onAction('website')} className="px-3 py-1 bg-slate-700 rounded">Website</button>
        <button onClick={() => onAction('research')} className="px-3 py-1 bg-slate-700 rounded">Research</button>
      </div>
    </div>
  )
}
