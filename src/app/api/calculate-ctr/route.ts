import { NextRequest, NextResponse } from 'next/server'
import { calculateViralScore } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { text, style } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const viralScore = calculateViralScore(text)

    // Calculate CTR based on viral score and style impact
    const styleBonus = style === 'neon-gradient' ? 5 : style === 'bold-red' ? 3 : 2
    const ctrScore = Math.min(100, viralScore + styleBonus)

    const factors = {
      textImpact: viralScore,
      styleImpact: styleBonus * 10,
      contrast: style.includes('dark') ? 8 : 7,
      emotionalTrigger: text.includes('SHOCK') || text.includes('INSANE') ? 9 : 5,
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ctrScore,
          factors,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Calculate CTR error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate CTR' },
      { status: 500 }
    )
  }
}
