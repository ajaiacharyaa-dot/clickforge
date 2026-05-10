import { NextRequest, NextResponse } from 'next/server'
import { generateTextHooks } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { videoTitle } = await request.json()

    if (!videoTitle) {
      return NextResponse.json(
        { error: 'Video title is required' },
        { status: 400 }
      )
    }

    const hooks = await generateTextHooks(videoTitle)

    return NextResponse.json(
      {
        success: true,
        data: { hooks },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Generate hooks error:', error)
    return NextResponse.json(
      { error: 'Failed to generate hooks' },
      { status: 500 }
    )
  }
}
