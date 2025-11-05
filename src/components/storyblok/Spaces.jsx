import Image from 'next/image'
import { storyblokEditable } from '@storyblok/react/rsc'

export default function Spaces({ blok }) {
  return (
    <section 
      className="spaces-section"
      {...storyblokEditable(blok)}
    >
      <div className="spaces-container">
        {/* Header */}
        {blok.title && (
          <div className="spaces-header">
            <h2 className="spaces-title">{blok.title}</h2>
            {blok.description && (
              <p className="spaces-description">{blok.description}</p>
            )}
          </div>
        )}

        {/* Spaces Grid */}
        {blok.spaces && blok.spaces.length > 0 && (
          <div className="spaces-grid">
            {blok.spaces.map((space, index) => (
              <div key={space._uid} className="space-item">
                {space.image && (
                  <div className="space-image">
                    <Image
                      src={space.image.filename}
                      alt={space.image.alt || space.title || `Space ${index + 1}`}
                      width={800}
                      height={600}
                      loading="lazy"
                      sizes="(min-width: 1024px) 33vw, 90vw"
                    />
                  </div>
                )}
                
                <div className="space-content">
                  {space.title && (
                    <h3 className="space-title">{space.title}</h3>
                  )}
                  
                  {space.description && (
                    <p className="space-description">{space.description}</p>
                  )}
                  
                  {space.features && space.features.length > 0 && (
                    <ul className="space-features">
                      {space.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>{feature.text}</li>
                      ))}
                    </ul>
                  )}
                  
                  {space.link && space.link.url && (
                    <a 
                      href={space.link.url}
                      className="space-link"
                      target={space.link.target || '_self'}
                    >
                      {space.link.text || 'Learn More'}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}