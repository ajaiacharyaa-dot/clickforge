import React from 'react'

export default function CreatePage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold">Create with NOA</h2>
      <p className="text-sm text-gray-300 mt-1">Choose a capability or describe what you want NOA to build.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-800 rounded">Thumbnail <div className="text-xs text-gray-400">Active</div></div>
        <div className="p-4 bg-slate-800 rounded">Image <div className="text-xs text-gray-400">Coming soon</div></div>
        <div className="p-4 bg-slate-800 rounded">Video <div className="text-xs text-gray-400">Coming soon</div></div>
        <div className="p-4 bg-slate-800 rounded">Hooks <div className="text-xs text-gray-400">Coming soon</div></div>
        <div className="p-4 bg-slate-800 rounded">Website <div className="text-xs text-gray-400">Coming soon</div></div>
      </div>
    </div>
  )
}
