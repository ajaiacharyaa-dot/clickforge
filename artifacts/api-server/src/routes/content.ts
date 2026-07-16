import { Router, type IRouter } from 'express'

const router: IRouter = Router()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

type ContentType = 'title' | 'hook' | 'script' | 'blog' | 'email' | 'social' | 'caption' | 'newsletter'

const PROMPTS: Record<ContentType, (topic: string, tone: string, platform: string, length: string) => string> = {
  title: (topic, tone, platform) =>
    `Generate 10 high-CTR ${platform ? platform + ' ' : ''}titles about "${topic}". Tone: ${tone}. Make them compelling, curiosity-driven, and optimized for clicks. Return one title per line, no numbering.`,

  hook: (topic, tone, platform) =>
    `Generate 8 powerful content hooks for "${topic}" for ${platform || 'general social media'}. Tone: ${tone}. Each hook should grab attention in the first line. Return one hook per line, no numbering.`,

  script: (topic, tone, _, length) =>
    `Write a ${length || 'medium'}-length video script about "${topic}". Tone: ${tone}. Include: Hook (first 15 seconds), Main content with clear sections, Call to action. Format with clear section labels.`,

  blog: (topic, tone, _, length) =>
    `Write a ${length || 'medium'}-length blog post about "${topic}". Tone: ${tone}. Include: SEO-optimized title, Introduction, 3-5 main sections with headers, Conclusion with CTA. Use markdown formatting.`,

  email: (topic, tone, _, length) =>
    `Write a ${length || 'medium'}-length marketing email about "${topic}". Tone: ${tone}. Include: Subject line options (3), Preview text, Email body with clear sections, CTA button text. Format clearly.`,

  social: (topic, tone, platform) =>
    `Write 5 social media posts about "${topic}" for ${platform || 'Instagram/X/LinkedIn'}. Tone: ${tone}. Each post should be platform-appropriate, include relevant hashtags, and drive engagement. Separate posts with ---`,

  caption: (topic, tone, platform) =>
    `Write 5 engaging ${platform || 'Instagram'} captions about "${topic}". Tone: ${tone}. Each caption should include a hook, body, call to action, and 5-10 relevant hashtags. Separate with ---`,

  newsletter: (topic, tone, _, length) =>
    `Write a ${length || 'medium'}-length email newsletter about "${topic}". Tone: ${tone}. Include: Subject line, Preview text, Intro, 3 main sections, Sponsor/CTA section, Sign-off. Format in markdown.`,
}

const FALLBACKS: Record<ContentType, string> = {
  title: '10 Ways to Master This Topic\nThe Ultimate Guide You Need\nWhy Everyone Is Talking About This\nThe Secret No One Told You\nHow to Do This in 30 Days',
  hook: 'Did you know that most people get this completely wrong?\nHere\'s what changed everything for me...\nStop doing this immediately.\nThe one thing experts don\'t want you to know.\nThis took me years to figure out.',
  script: '[HOOK]\nHave you ever wondered why...\n\n[MAIN CONTENT]\nToday I\'m going to show you...\n\n[CTA]\nIf you found this helpful, make sure to...',
  blog: '# The Ultimate Guide\n\n## Introduction\n\n## Main Point 1\n\n## Main Point 2\n\n## Conclusion',
  email: 'Subject: You won\'t believe this...\n\nHey [Name],\n\nI wanted to share something important...\n\n[CTA Button: Learn More]',
  social: 'Post 1: Sharing something I\'ve been working on...\n---\nPost 2: Here\'s what I\'ve learned recently...',
  caption: 'This changed everything for me. Here\'s why...\n\n#growth #creator #content\n---\nStop scrolling. You need to hear this.\n\n#motivation #tips',
  newsletter: '# This Week in [Topic]\n\n## What\'s New\n\n## Deep Dive\n\n## Resources\n\n## Until Next Week',
}

router.post('/content/generate', async (req, res) => {
  const {
    type,
    topic,
    tone = 'professional',
    platform = '',
    length = 'medium',
  } = req.body as {
    type: ContentType
    topic: string
    tone?: string
    platform?: string
    length?: string
  }

  if (!type || !topic) {
    return res.status(400).json({ error: 'type and topic are required' })
  }

  if (!PROMPTS[type]) {
    return res.status(400).json({ error: `Invalid content type. Use: ${Object.keys(PROMPTS).join(', ')}` })
  }

  if (!OPENAI_API_KEY) {
    return res.json({ content: FALLBACKS[type], type, topic, cached: true })
  }

  try {
    const prompt = PROMPTS[type](topic, tone, platform, length)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are ContentForge, an expert AI content creator. Generate high-quality, engaging content optimized for the requested platform and format. Be direct — return only the requested content, no preamble or explanation.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const json = (await response.json()) as any
    const content = json?.choices?.[0]?.message?.content ?? FALLBACKS[type]

    res.json({ content, type, topic })
  } catch (err) {
    req.log.error({ err }, 'content generate error')
    res.status(500).json({ error: 'Failed to generate content' })
  }
})

router.get('/content/types', (_req, res) => {
  res.json({
    types: [
      { id: 'title', label: 'Video Titles', description: 'High-CTR titles for YouTube & social', icon: 'type' },
      { id: 'hook', label: 'Content Hooks', description: 'Attention-grabbing opening lines', icon: 'zap' },
      { id: 'script', label: 'Video Script', description: 'Full scripts for videos & reels', icon: 'video' },
      { id: 'blog', label: 'Blog Post', description: 'Long-form articles & guides', icon: 'file-text' },
      { id: 'email', label: 'Email Campaign', description: 'Marketing emails & sequences', icon: 'mail' },
      { id: 'social', label: 'Social Posts', description: 'Multi-platform social content', icon: 'share-2' },
      { id: 'caption', label: 'Captions', description: 'Instagram, TikTok, Reels captions', icon: 'message-square' },
      { id: 'newsletter', label: 'Newsletter', description: 'Weekly email newsletter sections', icon: 'newspaper' },
    ],
  })
})

export default router
