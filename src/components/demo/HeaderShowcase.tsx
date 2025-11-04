'use client'

import SectionShell from '@/components/ui/SectionShell'
import SectionLayout from '@/components/ui/SectionLayout'

export default function HeaderShowcase() {
  return (
    <div data-clean-root="true">
      {/* Example 1: Fully Centered with Script Accent (FAQ style) */}
      <SectionShell
        container="prose"
        paddingY="lg"
        background="surface"
        divider="hairline"
      >
        <SectionLayout
          variant="legacy-full-centered"
          rails={{
            headerWidth: 'prose',
            contentWidth: 'prose',
            align: 'center'
          }}
          header={{
            kicker: 'Everything You Need to Know',  // Script accent in Dancing Script font
            title: 'Frequently Asked Questions',    // Main title in Playfair Display
            lead: 'Find answers to common questions about booking your special day at Rum River Barn', // Lead text
            align: 'center'
          }}
        >
          <p style={{ textAlign: 'center', color: 'var(--theme-text-secondary)' }}>
            Content would go here - this example shows centered header with all three text elements
          </p>
        </SectionLayout>
      </SectionShell>

      {/* Example 2: Wide Centered Header (Gallery style) */}
      <SectionShell
        container="wide"
        paddingY="lg"
        background="tint-rose"
        divider="thread-gold"
      >
        <SectionLayout
          variant="gallery-masonry"
          rails={{
            headerWidth: 'prose',    // Header stays narrow for readability
            contentWidth: 'wide',     // Content can be wide for gallery
            align: 'center'
          }}
          header={{
            kicker: 'Real Love Stories',
            title: 'Weddings at the Barn',
            lead: 'Every celebration tells a unique story of love, laughter, and happily ever after',
            align: 'center',
            max: 'prose'  // Constrains header width even if rail is wide
          }}
        >
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                aspectRatio: '1',
                background: `linear-gradient(135deg, #9D6B7B, #e5a477)`,
                borderRadius: '8px'
              }} />
            ))}
          </div>
        </SectionLayout>
      </SectionShell>

      {/* Example 3: Header Center, Content Left (Mixed alignment) */}
      <SectionShell
        container="content"
        paddingY="lg"
        background="surface"
        divider="hairline"
      >
        <SectionLayout
          variant="header-center-content-left"
          rails={{
            headerWidth: 'prose',
            contentWidth: 'content',
            align: 'left'
          }}
          header={{
            kicker: 'Your Perfect Venue',
            title: 'Why Choose Rum River Barn',
            lead: 'Discover what makes our venue the perfect setting for your unforgettable celebration',
            align: 'center'  // Header centered while content is left-aligned
          }}
        >
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Content is left-aligned</h3>
            <p style={{ color: 'var(--theme-text-secondary)' }}>
              Notice how the header above is centered with script accent, title, and lead text,
              while this content section is left-aligned. This pattern is perfect for features
              or services sections.
            </p>
          </div>
        </SectionLayout>
      </SectionShell>

      {/* Example 4: Hero with Dark Background */}
      <SectionShell
        bleed
        height="screen"
        tone="dark"
        background={{ 
          kind: 'image', 
          src: '/images/barn-interior-ceiling-beams-lighting.jpg',
          overlay: 'strong'
        }}
        paddingY="xl"
        divider="thread-gold"
      >
        <SectionLayout
          variant="home-hero-2024"
          rails={{
            headerWidth: 'content',
            contentWidth: 'content',
            align: 'center'
          }}
          header={{
            kicker: 'Welcome to',              // Will be in rose color
            title: 'Rum River Barn',           // Large, white on dark
            lead: 'Where rustic charm meets modern elegance in the heart of Minnesota',
            align: 'center',
            max: 'content'
          }}
          actions={{
            align: 'center',
            children: (
              <>
                <button className="btn-rose">Schedule Tour</button>
                <button className="btn-outline-gold">View Pricing</button>
              </>
            )
          }}
        />
      </SectionShell>

      {/* Example 5: Minimal - Title Only */}
      <SectionShell
        container="content"
        paddingY="md"
        background="tint-sage"
      >
        <SectionLayout
          rails={{
            headerWidth: 'content',
            contentWidth: 'content',
            align: 'center'
          }}
          header={{
            title: 'Sometimes You Only Need a Title',
            align: 'center'
          }}
        >
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            The header is flexible - use kicker, title, and lead in any combination
          </p>
        </SectionLayout>
      </SectionShell>

      {/* Example 6: All Text Elements with Custom Max Width */}
      <SectionShell
        container="wide"
        paddingY="lg"
        background="surface"
      >
        <SectionLayout
          rails={{
            headerWidth: 'wide',
            contentWidth: 'wide',
            align: 'center'
          }}
          header={{
            kicker: 'Minnesota\'s Premier Wedding Venue',
            title: 'Create Memories That Last Forever',
            lead: 'From intimate gatherings to grand celebrations, Rum River Barn provides the perfect backdrop for your special day. Our dedicated team ensures every detail is perfect.',
            align: 'center',
            max: 'prose'  // Even though rail is wide, header stays narrow for readability
          }}
        />
      </SectionShell>
    </div>
  )
}