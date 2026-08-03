'use client'

import React, { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import ImageUpload from '@/components/ImageUpload'
import { TitleInput } from '@/components/TitleInput'
import { HookSuggestions } from '@/components/HookSuggestions'
import ThumbnailPreview from '@/components/ThumbnailPreview'
import ExecutionPanel from '@/components/noa/ExecutionPanel'
import { useThumbnailSkill } from '@/lib/noa/skill-registry'
import { useNoa } from '@/lib/noa/state'

export default function ThumbnailStudio() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [hooks, setHooks] = useState<string[]>([])
  const [selectedHooks, setSelectedHooks] = useState<string[]>([])
  const [variations, setVariations] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const { run } = useThumbnailSkill()
  const noa = useNoa()

  const handleGenerateHooks = async () => {
    try {
      const resp = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoTitle: title }),
      })
      const body = await resp.json()
      setHooks(body?.data?.hooks || [])
    } catch (err) {
      console.error('hooks error', err)
    }
  }

  const handleSelectHook = (hook: string) => {
    setSelectedHooks((s) => (s.includes(hook) ? s.filter((h) => h !== hook) : [...s.slice(0, 2), hook]))
  }

  const handleRun = async () => {
    if (!imageUrl || !title) return alert('Image and title are required')
    setIsRunning(true)
    try {
      await run({ title, imageUrl, hooks: selectedHooks.length ? selectedHooks : hooks })
      // load artifacts from store
      // no-op here: state will update and persist
    } catch (err) {
      console.error('run failed', err)
    } finally {
      setIsRunning(false)
      // fetch latest artifacts
      // noop
    }
  }

  return (
    <AppShell>
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Thumbnail Studio</h1>
            <div className="text-xs text-gray-400">Powered by NOA</div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <div className="text-sm font-semibold mb-2">01 INPUT</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ImageUpload onImageUpload={(url) => setImageUrl(url)} />
              </div>
              <div>
                <TitleInput value={title} onChange={setTitle} />
                <div className="mt-4">
                  <button onClick={handleGenerateHooks} className="px-4 py-2 bg-indigo-600 rounded">Generate Hooks</button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">02 HOOKS</div>
            <HookSuggestions hooks={hooks} selectedHooks={selectedHooks} onSelectHook={handleSelectHook} isLoading={isRunning} />
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">03 GENERATE</div>
            <div className="flex items-center gap-3">
              <button onClick={handleRun} className={`px-4 py-2 rounded ${isRunning ? 'bg-gray-500' : 'bg-green-600'}`} disabled={isRunning}>
                {isRunning ? 'Running…' : 'Generate Thumbnails'}
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">04 ANALYZE</div>
            <div className="text-gray-400">Analysis runs automatically after generation.</div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">05 RESULT</div>
            <div>
              {/* Render artifacts produced by NOA */}
              <div className="mt-4">
                {/* Execution panel: show latest task */}
                {noa.tasks?.[0] && <ExecutionPanel task={noa.tasks[0]} />}
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  )
}
