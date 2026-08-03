'use client'

import { useNoa } from './state'

// Thin orchestration hook — can be called from pages/components
export const useThumbnailSkill = () => {
  const noa = useNoa()

  const run = async ({ title, imageUrl, hooks }: { title: string; imageUrl: string; hooks: string[] }) => {
    const steps = [
      { id: 'upload', title: 'Image prepared', status: 'completed' },
      { id: 'hooks', title: 'Generating hooks', status: 'queued' },
      { id: 'generate', title: 'Generating variants', status: 'queued' },
      { id: 'ctr', title: 'CTR analysis', status: 'queued' },
    ]

    const task = noa.createTask(`Create thumbnail for: ${title}`, steps)
    noa.setTaskStatus(task.id, 'running')

    try {
      // Generate hooks if none provided
      noa.updateStep(task.id, 'hooks', { status: 'running' })
      let generatedHooks = hooks
      if (!generatedHooks || generatedHooks.length === 0) {
        const resp = await fetch('/api/generate-hooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoTitle: title }),
        })
        const body = await resp.json()
        generatedHooks = body?.data?.hooks || []
      }
      noa.updateStep(task.id, 'hooks', { status: 'completed' })

      // Generate thumbnails
      noa.updateStep(task.id, 'generate', { status: 'running' })
      const genResp = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, hooks: generatedHooks, styles: [] }),
      })
      const genBody = await genResp.json()
      if (!genBody.success) throw new Error(genBody.error || 'Thumbnail generation failed')
      noa.updateStep(task.id, 'generate', { status: 'completed' })

      const variations = genBody.data?.variations || []

      // CTR evaluation
      noa.updateStep(task.id, 'ctr', { status: 'running' })
      for (const v of variations) {
        try {
          const ctrResp = await fetch('/api/calculate-ctr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: v.text_hook, style: v.style_applied }),
          })
          const ctrBody = await ctrResp.json()
          const ctrScore = ctrBody?.data?.ctrScore
          const artifact = {
            id: String(Date.now()) + Math.random().toString(36).slice(2, 9),
            type: 'thumbnail',
            name: `${title} - ${v.text_hook}`,
            previewUrl: v.image_url,
            status: 'completed',
            sourceTaskId: task.id,
            createdAt: new Date().toISOString(),
            metadata: { hook: v.text_hook, style: v.style_applied, ctrScore },
          }
          noa.addArtifact(artifact)
        } catch (err) {
          console.error('CTR error', err)
        }
      }
      noa.updateStep(task.id, 'ctr', { status: 'completed' })

      noa.setTaskStatus(task.id, 'completed')
    } catch (err: any) {
      console.error('Thumbnail skill failed', err)
      noa.updateStep(task.id, 'generate', { status: 'failed', error: String(err) })
      noa.setTaskStatus(task.id, 'failed')
      throw err
    }
  }

  return { run }
}
