import { NextRequest, NextResponse } from 'next/server'
import { addTextToImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, hooks, styles } = await request.json()

    if (!imageUrl || !hooks || hooks.length === 0) {
      return NextResponse.json(
        { error: 'Image URL and hooks are required' },
        { status: 400 }
      )
    }

    const variations = hooks.slice(0, 3).map((hook: string, index: number) => {
      const style = styles[index] || 'bold-red'
      const generatedUrl = addTextToImage(imageUrl, hook, style)

      return {
        variant_number: index + 1,
        text_hook: hook,
        style_applied: style,
        image_url: generatedUrl,
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: { variations },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Generate thumbnail error:', error)
    return NextResponse.json(
      { error: 'Failed to generate thumbnail' },
      { status: 500 }
    )
  }
}
