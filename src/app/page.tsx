// src/app/page.tsx
export const dynamic = 'force-dynamic'

async function fetchStory(slug: string) {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN
  if (!token) throw new Error('Missing NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN')
  const version = process.env.NODE_ENV === 'production' ? 'published' : 'draft'
  const url = `https://api.storyblok.com/v2/cdn/stories/${slug}?version=${version}&cv=${Date.now()}&token=${token}`

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Storyblok fetch failed (${res.status}): ${text}`)
  }
  const data = await res.json()
  return data.story
}

import CleanStoryRenderer from '@/components/clean/CleanStoryRenderer'
import GlassToolbar from '@/components/dev/GlassToolbar'

export default async function HomePage() {
  const story = await fetchStory('home')
  return (
    <div className="glass-toolbar-layout">
      <GlassToolbar />
      <main className="glass-toolbar-layout__content">
        <CleanStoryRenderer story={story} />
      </main>
    </div>
  )
}