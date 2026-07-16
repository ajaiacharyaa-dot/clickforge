import { Router, type IRouter } from 'express'

const router: IRouter = Router()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const JARVIS_SYSTEM = `You are Jarvis, the central AI intelligence of ClickForge — the world's first AI Operating System for creators and entrepreneurs.

ClickForge modules you can help with:
- ThumbnailForge: AI YouTube thumbnail generation, hooks, CTR scoring
- ContentForge: titles, hooks, scripts, blogs, newsletters, sales copy, social content
- ResearchForge: market research, competitor analysis, trend discovery
- SocialForge: scheduling posts and DMs across YouTube, Instagram, TikTok, X, LinkedIn, Facebook
- VideoForge: AI video creation (coming soon)
- VoiceForge: text-to-speech, voice cloning, podcasts (coming soon)
- StoreForge: products, courses, memberships, digital downloads (coming soon)
- AgentForge: custom AI agents for research, marketing, sales, support (coming soon)
- LearnForge: personalized learning, AI tutors, skill roadmaps (coming soon)
- WorkForge: jobs, hiring, freelance, team building (coming soon)

You are capable, direct, and action-oriented. When a user asks you to do something, either execute it or clearly explain what information you need. Always suggest which ClickForge module is best for their goal. Keep responses concise and useful.`

router.post('/jarvis/chat', async (req, res) => {
  const { messages, context } = req.body as {
    messages: { role: 'user' | 'assistant'; content: string }[]
    context?: string
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  if (!OPENAI_API_KEY) {
    const lastMsg = messages[messages.length - 1]?.content ?? ''
    return res.json({
      role: 'assistant',
      content: `I'm Jarvis, your ClickForge AI OS. I received: "${lastMsg.slice(0, 60)}..." — add your OPENAI_API_KEY secret to enable full AI responses.`,
    })
  }

  try {
    const systemMessages = [{ role: 'system', content: JARVIS_SYSTEM }]
    if (context) {
      systemMessages.push({ role: 'system', content: `Current context: ${context}` })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [...systemMessages, ...messages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    const json = (await response.json()) as any
    const content = json?.choices?.[0]?.message?.content ?? 'I had trouble generating a response. Please try again.'

    res.json({ role: 'assistant', content })
  } catch (err) {
    req.log.error({ err }, 'jarvis chat error')
    res.status(500).json({ error: 'Failed to generate response' })
  }
})

export default router
