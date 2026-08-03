import React from 'react'
import AppShell from '../components/layout/AppShell'

export default function Home() {
  return (
    <AppShell>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white">NOA</h1>
        <p className="mt-2 text-sm text-gray-300">What do you want to build?</p>
      </div>
    </AppShell>
  )
}
