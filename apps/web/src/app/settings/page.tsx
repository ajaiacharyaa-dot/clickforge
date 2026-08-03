import React from 'react'

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <p className="text-sm text-gray-300 mt-1">Appearance, NOA Preferences, Connected Services</p>
      <div className="mt-6 text-gray-400">Connected Services: Supabase — Not configured; Cloudinary — Not configured; OpenAI — Not configured</div>
    </div>
  )
}
