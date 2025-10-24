import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchStory } from '@/lib/storyblok'
import StoryblokBridge from '@/components/storyblok/client/StoryblokBridge'

// Enable dynamic rendering for Visual Editor support
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface WeddingPageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: WeddingPageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await fetchStory(`real-weddings/${slug}`, 'draft')

  if (!story) {
    return {
      title: 'Wedding Not Found',
    }
  }

  const wedding = story.content

  return {
    title: wedding.meta_title || `${wedding.title} | Real Weddings | Rum River Barn`,
    description: wedding.meta_description || wedding.intro || `View beautiful wedding photos from ${wedding.title} at Rum River Barn in Minnesota.`,
    openGraph: {
      title: wedding.meta_title || `${wedding.title} | Real Weddings`,
      description: wedding.meta_description || wedding.intro,
      images: wedding.og_image?.filename ? [wedding.og_image.filename] : wedding.hero_image?.filename ? [wedding.hero_image.filename] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: wedding.meta_title || `${wedding.title} | Real Weddings`,
      description: wedding.meta_description || wedding.intro,
      images: wedding.og_image?.filename ? [wedding.og_image.filename] : wedding.hero_image?.filename ? [wedding.hero_image.filename] : [],
    }
  }
}

export default async function WeddingPage({ params }: WeddingPageProps) {
  const { slug } = await params
  const story = await fetchStory(`real-weddings/${slug}`, 'draft')

  // Return 404 if wedding not found or not published
  if (!story || !story.content.is_published) {
    notFound()
  }

  return (
    <>
      <StoryblokBridge initialStory={story} />

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: `${story.content.title} Wedding`,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: {
              '@type': 'Place',
              name: 'Rum River Barn',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Hillman',
                addressRegion: 'MN',
                addressCountry: 'US'
              }
            },
            image: story.content.hero_image?.filename || '',
            description: story.content.intro || `Wedding celebration at Rum River Barn`,
            startDate: story.content.wedding_date || new Date().toISOString(),
            organizer: {
              '@type': 'Organization',
              name: 'Rum River Barn',
              url: 'https://storyblok-rumrivermn-netlify.netlify.app'
            }
          })
        }}
      />
    </>
  )
}
