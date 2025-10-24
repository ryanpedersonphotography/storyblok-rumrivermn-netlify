import { draftMode } from 'next/headers'
import { fetchStory } from '@/lib/storyblok'
import ClientBridge from './ClientBridge'

export default async function HomeLivePage() {
  const { isEnabled } = await draftMode()
  const story = await fetchStory('home', isEnabled ? 'draft' : 'published')

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