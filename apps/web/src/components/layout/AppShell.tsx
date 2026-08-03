import React from 'react'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      <div className="flex">
        <aside className="w-72 bg-slate-800 p-4">
          <div className="text-xl font-semibold">ClickForge</div>
          <nav className="mt-6 space-y-2">
            <a href="/" className="block px-3 py-2 rounded hover:bg-slate-700">Home</a>
            <a href="/create" className="block px-3 py-2 rounded hover:bg-slate-700">Create</a>
            <a href="/workflows" className="block px-3 py-2 rounded hover:bg-slate-700">Workflows</a>
            <a href="/projects" className="block px-3 py-2 rounded hover:bg-slate-700">Projects</a>
            <a href="/assets" className="block px-3 py-2 rounded hover:bg-slate-700">Assets</a>
            <a href="/analytics" className="block px-3 py-2 rounded hover:bg-slate-700">Analytics</a>
          </nav>
          <div className="mt-auto pt-6">
            <a href="/settings" className="block px-3 py-2 rounded hover:bg-slate-700">Settings</a>
            <a href="/profile" className="block px-3 py-2 rounded hover:bg-slate-700">Profile</a>
          </div>
        </aside>

        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
