import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClickForge - AI YouTube Thumbnail Generator',
  description: 'Generate viral-optimized YouTube thumbnails with AI',
  keywords: 'YouTube, thumbnail, generator, AI, CTR, viral',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
