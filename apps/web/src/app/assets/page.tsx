import React from 'react'
import AppShell from '@/components/layout/AppShell'
import { useNoa } from '@/lib/noa/state'
import ArtifactGrid from '@/components/artifacts/ArtifactGrid'

export default function AssetsPage() {
  const noa = useNoa()

  return (
    <AppShell>
      <div className="p-8">
        <h2 className="text-2xl font-semibold">Assets</h2>
        <p className="text-sm text-gray-300 mt-1">Images, thumbnails, videos, documents</p>

        <div className="mt-6">
          {noa.artifacts?.length === 0 ? (
            <div className="text-gray-400">No assets yet.</div>
          ) : (
            <ArtifactGrid artifacts={noa.artifacts} />
          )}
        </div>
      </div>
    </AppShell>
  )
}
