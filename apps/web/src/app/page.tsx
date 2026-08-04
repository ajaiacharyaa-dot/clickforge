'use client'

import React, { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import NOAComposer from '@/components/noa/NOAComposer'
import ArtifactGrid from '@/components/artifacts/ArtifactGrid'

export default function Home() {
  const [artifacts, setArtifacts] = useState<any[]>([])

  useEffect(() => {
    // placeholder: load artifacts from localStorage if present
    const json = localStorage.getItem('noa:artifacts')
    if (json) setArtifacts(JSON.parse(json))
  }, [])

  useEffect(() => {
    localStorage.setItem('noa:artifacts', JSON.stringify(artifacts))
  }, [artifacts])

  return (
    <AppShell>
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">NOA</h1>
            <p className="text-sm text-gray-300 mt-1">What do you want to build?</p>
          </div>
          <div className="text-sm text-gray-400">Status: <span className="text-green-400">Ready</span></div>
        </div>

        <div className="mt-6">
          <NOAComposer onAction={(action) => {
            if (action === 'thumbnail') {
              window.location.href = '/create/thumbnail'
            }
          }} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Recent Work</h2>
          {artifacts.length === 0 ? (
            <div className="mt-4 text-gray-400">No artifacts yet. Create something with NOA.</div>
          ) : (
            <div className="mt-4">
              <ArtifactGrid artifacts={artifacts} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
