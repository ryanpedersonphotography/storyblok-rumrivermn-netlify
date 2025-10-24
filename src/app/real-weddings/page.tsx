import { Metadata } from 'next'
import { fetchStories } from '@/lib/storyblok'
import Link from 'next/link'
import FooterEditor from '@/components/storyblok/FooterEditor'
import './real-weddings-listing.css'

export const metadata: Metadata = {
  title: 'Real Weddings at the Barn | Rum River Wedding Barn',
  description: 'Browse our collection of beautiful weddings at Rum River Barn in Hillman, Minnesota. Get inspired by real couples and their special days.',
  openGraph: {
    title: 'Real Weddings at the Barn | Rum River Wedding Barn',
    description: 'Browse our collection of beautiful weddings at Rum River Barn in Hillman, Minnesota.',
    type: 'website'
  }
}

export const revalidate = 3600 // Revalidate every hour

export default async function RealWeddingsPage() {
  // Fetch all published weddings from Storyblok
  const stories = await fetchStories({
    starts_with: 'real-weddings/',
    is_startpage: false,
    filter_query: {
      is_published: {
        is: true
      }
    },
    sort_by: 'content.wedding_date:desc',
    per_page: 100
  })

  const weddings = stories.map((story: any) => ({
    uuid: story.uuid,
    slug: story.slug,
    full_slug: story.full_slug,
    title: story.content.title,
    wedding_date: story.content.wedding_date,
    location: story.content.location,
    cover_image: story.content.cover_image?.filename || story.content.hero_image?.filename,
    guest_count: story.content.guest_count,
    photo_count: story.content.gallery_photos?.length || 0
  }))

  return (
    <div className="real-weddings-listing-page">
      {/* Hero Section */}
      <section className="listing-hero hotfix-hero-romantic hotfix-hero-compact">
        <div className="listing-hero-overlay"></div>
        <div className="hotfix-hero-content">
          <div className="hotfix-hero-kicker">Love Stories</div>
          <h1 className="hotfix-hero-title">Real Weddings at the Barn</h1>
          <p className="hotfix-hero-description">
            Discover the unique celebrations and love stories from couples who chose Rum River Barn for their special day
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="hotfix-alternating-blocks">
        <div className="hotfix-content-wrapper">
          <div className="listing-stats">
            <div className="stat-item">
              <span className="stat-number">{weddings.length}</span>
              <span className="stat-label">Weddings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{weddings.reduce((sum: number, w: any) => sum + w.photo_count, 0)}</span>
              <span className="stat-label">Photos</span>
            </div>
          </div>

          {/* Wedding Grid */}
          <div className="weddings-grid">
            {weddings.map((wedding: any) => {
              const slug = wedding.full_slug?.replace('real-weddings/', '') || wedding.slug

              return (
                <Link
                  key={wedding.uuid}
                  href={`/real-weddings/${slug}`}
                  className="wedding-card"
                >
                  {wedding.cover_image && (
                    <div className="wedding-image">
                      <img
                        src={wedding.cover_image}
                        alt={`${wedding.title} wedding at Rum River Barn`}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="wedding-overlay">
                    <div className="wedding-couple-names">
                      {wedding.title}
                    </div>
                    {wedding.wedding_date && (
                      <div className="wedding-date">{wedding.wedding_date}</div>
                    )}
                    {wedding.photo_count > 0 && (
                      <div className="wedding-photo-count">{wedding.photo_count} photos</div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          {weddings.length === 0 && (
            <div className="no-weddings">
              <p>No weddings to display at this time. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <FooterEditor blok={{
        _uid: 'footer-weddings-listing',
        component: 'footer_section',
        brand_title: 'Rum River Wedding Barn',
        tagline: 'Where rustic charm meets modern elegance',
        address: '42618 78th Street, Hillman, MN 56338',
        phone: '612-801-0546',
        email: 'info@rumriverbarn.com',
        facebook_url: 'https://facebook.com/rumriverbarn',
        instagram_url: 'https://instagram.com/rumriverbarn'
      }} />
    </div>
  )
}
