import axios from 'axios'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export const generateTextHooks = async (videoTitle: string): Promise<string[]> => {
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
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const content = response.data.choices[0].message.content
    const hooks = content.split('\n').filter((h: string) => h.trim().length > 0)
    return hooks.slice(0, 5)
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

  let score = 50 // Base score

  // Check for power words
  powerWords.forEach((word) => {
    if (text.toUpperCase().includes(word)) score += 15
  })

  // Check for emotional triggers
  emotionalTriggers.forEach((word) => {
    if (text.toUpperCase().includes(word)) score += 10
  })

  // Penalize if too long
  if (text.length > 40) score -= 10

  // Bonus for ALL CAPS
  if (text === text.toUpperCase() && text.length > 2) score += 10

  return Math.min(100, Math.max(0, score))
}
