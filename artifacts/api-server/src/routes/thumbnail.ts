import { Router, type IRouter } from 'express'
import multer from 'multer'
import { generateTextHooks, calculateViralScore } from '../lib/ai.js'
import { uploadImageBuffer, addTextToImage } from '../lib/cloudinary.js'

const router: IRouter = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

// POST /api/generate-hooks
router.post('/generate-hooks', async (req, res) => {
  try {
    const { videoTitle } = req.body as { videoTitle?: string }

    if (!videoTitle) {
      res.status(400).json({ error: 'Video title is required' })
      return
    }

    const hooks = await generateTextHooks(videoTitle)

    res.json({ success: true, data: { hooks } })
  } catch (error) {
    req.log.error({ error }, 'generate-hooks error')
    res.status(500).json({ error: 'Failed to generate hooks' })
  }
})

// POST /api/calculate-ctr
router.post('/calculate-ctr', async (req, res) => {
  try {
    const { text, style } = req.body as { text?: string; style?: string }

    if (!text) {
      res.status(400).json({ error: 'Text is required' })
      return
    }

    const viralScore = calculateViralScore(text)
    const styleStr = String(style || '').toLowerCase()

    let styleBonus = 0
    if (styleStr.includes('neon-gradient')) styleBonus += 8
    else if (styleStr.includes('bold-red')) styleBonus += 6
    else if (styleStr.includes('shadow-dark')) styleBonus += 7
    else if (styleStr.includes('bright-yellow')) styleBonus += 7
    else styleBonus += 4

    if (styleStr.includes('stroke')) styleBonus += 4
    if (styleStr.includes('shadow')) styleBonus += 3
    if (styleStr.includes('zoom') || styleStr.includes('face')) styleBonus += 6

    const contrast = styleStr.includes('neon') || styleStr.includes('bright') ? 9 : styleStr.includes('dark') ? 8 : 7
    const emotionalTrigger = /SHOCK|INSANE|EXPOSED|UNBELIEVABLE|FINALLY|AMAZING/i.test(text) ? 9 : 5
    const ctrScore = Math.max(10, Math.min(100, Math.round(viralScore + styleBonus)))

    const factors = {
      textImpact: viralScore,
      styleImpact: styleBonus,
      contrast,
      emotionalTrigger,
    }

    res.json({ success: true, data: { ctrScore, factors } })
  } catch (error) {
    req.log.error({ error }, 'calculate-ctr error')
    res.status(500).json({ error: 'Failed to calculate CTR' })
  }
})

// POST /api/generate-thumbnail
router.post('/generate-thumbnail', async (req, res) => {
  try {
    const { imageUrl, hooks, styles } = req.body as {
      imageUrl?: string
      hooks?: string[]
      styles?: string[]
    }

    if (!imageUrl || !hooks || hooks.length === 0) {
      res.status(400).json({ error: 'Image URL and hooks are required' })
      return
    }

    const variations = (hooks as string[]).slice(0, 3).map((hook: string, index: number) => {
      const style = (styles || [])[index] || 'bold-red'
      const generatedUrl = addTextToImage(imageUrl, hook, style)

      return {
        variant_number: index + 1,
        text_hook: hook,
        style_applied: style,
        image_url: generatedUrl,
      }
    })

    res.json({ success: true, data: { variations } })
  } catch (error) {
    req.log.error({ error }, 'generate-thumbnail error')
    res.status(500).json({ error: 'Failed to generate thumbnail' })
  }
})

// POST /api/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' })
      return
    }

    const imageUrl = await uploadImageBuffer(req.file.buffer, req.file.originalname)

    res.json({ success: true, data: { imageUrl } })
  } catch (error) {
    req.log.error({ error }, 'upload error')
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

export default router
