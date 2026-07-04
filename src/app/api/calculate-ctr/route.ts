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

    // Enhanced CTR calculation that rewards improved visual features:
    // - Large text (mobile-first)
    // - Black stroke (readability)
    // - Shadow (depth & contrast)
    // - Top/bottom positioning (better composition)
    // - Face zoom (engagement)
    const styleStr = String(style || '').toLowerCase()

    let styleBonus = 0

    // Base style bonuses
    if (styleStr.includes('neon-gradient')) styleBonus += 8
    else if (styleStr.includes('bold-red')) styleBonus += 6
    else if (styleStr.includes('shadow-dark')) styleBonus += 7
    else if (styleStr.includes('bright-yellow')) styleBonus += 7
    else styleBonus += 4

    // Bonus for visual features in the improved pipeline
    if (styleStr.includes('stroke')) styleBonus += 4
    if (styleStr.includes('shadow')) styleBonus += 3
    if (styleStr.includes('zoom') || styleStr.includes('face')) styleBonus += 6

    // Contrast bonus
    const contrast = styleStr.includes('neon') || styleStr.includes('bright') ? 9 : styleStr.includes('dark') ? 8 : 7

    // Emotional trigger detection
    const emotionalTrigger = /SHOCK|INSANE|EXPOSED|UNBELIEVABLE|FINALLY|AMAZING/i.test(text) ? 9 : 5

    // Final CTR: text impact + style improvements, clamped to 0-100
    const ctrScore = Math.max(10, Math.min(100, Math.round(viralScore + styleBonus)))

    const factors = {
      textImpact: viralScore,
      styleImpact: styleBonus,
      contrast,
      emotionalTrigger,
      visualQuality: 'improved', // indicates this uses the new overlay pipeline
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
