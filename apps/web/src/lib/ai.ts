import axios from 'axios'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const parseHooksFromContent = (content: string): string[] => {
  if (!content) return []
  const lines = content
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  const cleaned = lines.map((l) =>
    l.replace(/^\d+\.\s*/, '').replace(/^[-–•]\s*/, '').trim()
  )
  return cleaned.slice(0, 5)
}

export const generateTextHooks = async (videoTitle: string): Promise<string[]> => {
  if (!OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY is not set. Returning fallback hooks.')
    return [
      'YOU WONT BELIEVE',
      'SHOCKING TRUTH',
      'INSANE RESULTS',
      'FINALLY EXPOSED',
      'MUST WATCH',
    ]
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a YouTube thumbnail expert. Generate 5 viral text hooks for a YouTube thumbnail.

Rules:
- Each hook should be 2-8 words max
- Use power words: EXPOSED, INSANE, FINALLY, GONE WRONG, UNBELIEVABLE
- Create emotional triggers: curiosity gaps, urgency, exclusivity
- ALL CAPS for emphasis when appropriate
- Avoid clickbait that's illegal/misleading

Return ONLY the hooks, one per line, no numbering or extra text.`,
            name: 'system',
          },
          {
            role: 'user',
            content: `Video title: "${videoTitle}"\n\nGenerate 5 short, viral text hooks for the thumbnail.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    )

    const choices = response.data?.choices
    let content = ''
    if (Array.isArray(choices) && choices.length > 0) {
      const first = choices[0]
      content =
        first?.message?.content ??
        first?.text ??
        (typeof first === 'string' ? first : '')
    }

    const hooks = parseHooksFromContent(content)
    if (hooks.length > 0) return hooks

    const raw = JSON.stringify(response.data)
    const fallbackHooks = parseHooksFromContent(raw)
    if (fallbackHooks.length > 0) return fallbackHooks

    return [
      'YOU WONT BELIEVE',
      'SHOCKING TRUTH',
      'INSANE RESULTS',
      'FINALLY EXPOSED',
      'MUST WATCH',
    ]
  } catch (error) {
    console.error('Failed to generate hooks:', error)
    return [
      'YOU WONT BELIEVE',
      'SHOCKING TRUTH',
      'INSANE RESULTS',
      'FINALLY EXPOSED',
      'MUST WATCH',
    ]
  }
}

export const calculateViralScore = (text: string): number => {
  const powerWords = ['EXPOSED', 'INSANE', 'FINALLY', 'GONE WRONG', 'UNBELIEVABLE']
  const emotionalTriggers = ['SHOCKED', 'ANGRY', 'LOVE', 'HATE', 'FEAR']

  let score = 50
  powerWords.forEach((word) => {
    if (text.toUpperCase().includes(word)) score += 15
  })
  emotionalTriggers.forEach((word) => {
    if (text.toUpperCase().includes(word)) score += 10
  })
  if (text.length > 40) score -= 10
  if (text === text.toUpperCase() && text.length > 2) score += 10
  return Math.min(100, Math.max(0, score))
}
