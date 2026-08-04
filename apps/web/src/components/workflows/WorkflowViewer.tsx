import React from 'react'

export default function WorkflowViewer({ workflow }: { workflow?: any }) {
  // Simple static pipeline visualization for thumbnail workflow
  const nodes = [
    'Input',
    'Hook Generation',
    'Thumbnail Generation',
    'CTR Analysis',
    'Artifact',
  ]

  return (
    <div className="p-4 bg-slate-800 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Workflow</h3>
      </div>
      <div className="mt-4 flex items-center space-x-4 overflow-auto">
        {nodes.map((n, i) => (
          <div key={n} className="flex items-center space-x-2">
            <div className="px-4 py-2 bg-slate-700 rounded text-sm">{String(i + 1).padStart(2, '0')}</div>
            <div className="px-4 py-2 bg-slate-800 rounded border border-slate-700">{n}</div>
            {i < nodes.length - 1 && <div className="text-gray-500">→</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
