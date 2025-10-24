import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const uuid = searchParams.get('uuid')
  const version = searchParams.get('version') || 'draft'

  if (!uuid) {
    return NextResponse.json({ error: 'UUID is required' }, { status: 400 })
  }

  try {
    const token = process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN

    // Correct format: UUID in path, not query param
    // Returns { story: {...} } instead of { stories: [...] }
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories/${uuid}?token=${token}&version=${version}&find_by=uuid`,
      {
        next: { revalidate: version === 'draft' ? 0 : 3600 }
      }
    )

    if (!response.ok) {
      throw new Error(`Storyblok API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    return NextResponse.json(data.story)
  } catch (error) {
    console.error('Error fetching story:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}
