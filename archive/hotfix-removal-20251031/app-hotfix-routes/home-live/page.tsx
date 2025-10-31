import { draftMode } from 'next/headers'
import { fetchStory } from '@/lib/storyblok'
import ClientBridge from './ClientBridge'

// Disable all caching for Visual Editor route
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'

export default async function HomeLivePage() {
  // Always use draft version for Visual Editor route
  const story = await fetchStory('home', 'draft')

  if (!story) {
    return (
      <div className="error-container">
        <h1>Story not found</h1>
        <p>The story &quot;home&quot; could not be loaded.</p>
      </div>
    )
  }

  return <ClientBridge initialStory={story} />
}