'use client'

import React from 'react'
import ArtifactCard from './ArtifactCard'

export default function ArtifactGrid({ artifacts }: { artifacts: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {artifacts.map((a) => (
        <ArtifactCard key={a.id} artifact={a} />
      ))}
    </div>
  )
}
