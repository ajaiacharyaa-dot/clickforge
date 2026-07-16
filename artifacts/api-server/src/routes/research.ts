import { Router, type IRouter } from 'express'

const router: IRouter = Router()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

type ResearchType = 'market' | 'competitor' | 'trend' | 'audience' | 'keyword' | 'general'

const RESEARCH_PROMPTS: Record<ResearchType, (query: string) => string> = {
  market: (query) =>
    `Provide a detailed market research analysis for: "${query}"

Structure your response as JSON with these fields:
{
  "summary": "2-3 sentence overview",
  "marketSize": "estimated market size and growth rate",
  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "challenges": ["challenge 1", "challenge 2", "challenge 3"],
  "keyPlayers": [{"name": "...", "description": "..."}],
  "targetAudience": "who the target customer is",
  "trends": ["trend 1", "trend 2", "trend 3"],
  "recommendation": "actionable recommendation"
}`,

  competitor: (query) =>
    `Analyze the competitive landscape for: "${query}"

Structure your response as JSON:
{
  "summary": "overview of competitive landscape",
  "competitors": [
    {
      "name": "competitor name",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "uniqueValue": "their unique value proposition"
    }
  ],
  "gaps": ["market gap 1", "market gap 2"],
  "differentiators": ["how to stand out 1", "how to stand out 2"],
  "recommendation": "strategic recommendation"
}`,

  trend: (query) =>
    `Identify current and emerging trends for: "${query}"

Structure your response as JSON:
{
  "summary": "trend overview",
  "currentTrends": [{"trend": "...", "why": "...", "opportunity": "..."}],
  "emergingTrends": [{"trend": "...", "timeline": "...", "potential": "..."}],
  "decliningTrends": ["declining trend 1", "declining trend 2"],
  "contentOpportunities": ["content idea 1", "content idea 2", "content idea 3"],
  "recommendation": "how to leverage these trends"
}`,

  audience: (query) =>
    `Define the target audience for: "${query}"

Structure your response as JSON:
{
  "summary": "audience overview",
  "demographics": {
    "ageRange": "...",
    "gender": "...",
    "location": "...",
    "income": "..."
  },
  "psychographics": {
    "interests": ["interest 1", "interest 2"],
    "values": ["value 1", "value 2"],
    "painPoints": ["pain 1", "pain 2"],
    "goals": ["goal 1", "goal 2"]
  },
  "platforms": ["platform they use most"],
  "contentPreferences": ["what content they engage with"],
  "recommendation": "how to reach this audience"
}`,

  keyword: (query) =>
    `Generate keyword and SEO research for: "${query}"

Structure your response as JSON:
{
  "summary": "SEO overview",
  "primaryKeywords": [{"keyword": "...", "intent": "...", "competition": "low/medium/high"}],
  "longTailKeywords": ["keyword phrase 1", "keyword phrase 2", "keyword phrase 3"],
  "youtubeKeywords": ["youtube search 1", "youtube search 2"],
  "contentIdeas": ["content idea based on keywords 1", "idea 2", "idea 3"],
  "recommendation": "SEO strategy recommendation"
}`,

  general: (query) =>
    `Research and summarize information about: "${query}"

Structure your response as JSON:
{
  "summary": "comprehensive overview",
  "keyFacts": ["fact 1", "fact 2", "fact 3", "fact 4", "fact 5"],
  "insights": ["insight 1", "insight 2", "insight 3"],
  "actionableSteps": ["step 1", "step 2", "step 3"],
  "resources": ["resource type 1", "resource type 2"],
  "recommendation": "main recommendation"
}`,
}

router.post('/research/query', async (req, res) => {
  const { query, type = 'general' } = req.body as { query: string; type?: ResearchType }

  if (!query) {
    return res.status(400).json({ error: 'query is required' })
  }

  if (!RESEARCH_PROMPTS[type as ResearchType]) {
    return res.status(400).json({ error: `Invalid type. Use: ${Object.keys(RESEARCH_PROMPTS).join(', ')}` })
  }

  if (!OPENAI_API_KEY) {
    return res.json({
      summary: `Research results for "${query}" will appear here once OPENAI_API_KEY is configured.`,
      keyFacts: ['Add your OpenAI API key to enable real AI research.'],
      insights: ['ResearchForge uses GPT-4o-mini to synthesize market intelligence.'],
      actionableSteps: ['Configure OPENAI_API_KEY in your secrets to activate this feature.'],
      resources: [],
      recommendation: 'Enable AI-powered research by adding the OpenAI secret.',
      cached: true,
    })
  }

  try {
    const prompt = RESEARCH_PROMPTS[type as ResearchType](query)

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
            content: 'You are ResearchForge, an expert AI research analyst. Provide accurate, actionable research insights. Always respond with valid JSON only — no markdown code blocks, no preamble.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    })

    const json = (await response.json()) as any
    const raw = json?.choices?.[0]?.message?.content ?? '{}'
    const data = JSON.parse(raw)

    res.json({ ...data, query, type })
  } catch (err) {
    req.log.error({ err }, 'research query error')
    res.status(500).json({ error: 'Failed to generate research' })
  }
})

router.get('/research/types', (_req, res) => {
  res.json({
    types: [
      { id: 'market', label: 'Market Research', description: 'Market size, opportunities & players', icon: 'trending-up' },
      { id: 'competitor', label: 'Competitor Analysis', description: 'Competitive landscape & gaps', icon: 'crosshair' },
      { id: 'trend', label: 'Trend Discovery', description: 'Current & emerging trends', icon: 'activity' },
      { id: 'audience', label: 'Audience Analysis', description: 'Demographics, psychographics & behavior', icon: 'users' },
      { id: 'keyword', label: 'Keyword Research', description: 'SEO & YouTube keyword opportunities', icon: 'search' },
      { id: 'general', label: 'General Research', description: 'Any topic, synthesized clearly', icon: 'book-open' },
    ],
  })
})

export default router
