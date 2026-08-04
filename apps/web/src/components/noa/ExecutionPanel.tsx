'use client'

import React from 'react'

export default function ExecutionPanel({ task }: { task: any }) {
  if (!task) return null

  return (
    <div className="p-4 bg-slate-800 rounded-lg">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <div className="mt-3 space-y-2">
        {task.steps.map((s: any, idx: number) => (
          <div key={s.id} className="flex items-start space-x-3">
            <div className="w-6">
              {s.status === 'completed' && <span className="text-green-400">✓</span>}
              {s.status === 'running' && <span className="text-yellow-300">●</span>}
              {s.status === 'waiting' && <span className="text-gray-400">○</span>}
              {s.status === 'failed' && <span className="text-red-400">✕</span>}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{s.title}</div>
              {s.error && <div className="text-xs text-red-400 mt-1">{String(s.error)}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
