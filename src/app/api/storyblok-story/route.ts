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

    if (!token) {
      console.error('[API Route] No STORYBLOK_PREVIEW_TOKEN found')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Correct format: UUID in path, not query param
    // Returns { story: {...} } instead of { stories: [...] }
    const url = `https://api.storyblok.com/v2/cdn/stories/${uuid}?token=${token}&version=${version}&find_by=uuid`
    console.log(`[API Route] Fetching: ${url.replace(token, 'TOKEN')}`)

    const response = await fetch(url, {
      next: { revalidate: version === 'draft' ? 0 : 3600 }
    })

    console.log(`[API Route] Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[API Route] Error response:`, errorBody)
      throw new Error(`Storyblok API error: ${response.status} - ${errorBody}`)
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
