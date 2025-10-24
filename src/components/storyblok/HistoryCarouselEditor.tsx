'use client';

import { useCallback, useEffect, useState } from 'react';
import { storyblokEditable } from '@storyblok/react/rsc';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface HistorySlideProps {
  _uid: string;
  component: string;
  year?: string;
  title?: string;
  description?: string;
  image?: any;
  [key: string]: any;
}

interface HistoryCarouselProps {
  blok: {
    _uid: string;
    component: string;
    script_accent?: string;
    section_title?: string;
    lead_text?: string;
    slides?: HistorySlideProps[];
    [key: string]: any;
  };
}

// Generate array of local history images
const historyImages = Array.from({ length: 31 }, (_, i) => {
  const num = (i + 1).toString().padStart(5, '0');
  return `/images/history/history-${num}.jpg`;
});

// Historical data to match images
const historicalData = [
  { year: '1914', title: 'Norwegian Settlers Arrive', description: 'Sigvart and Helga Selmer settled the land' },
  { year: '1920s', title: 'Early Farm Life', description: 'Building the foundation of the farm' },
  { year: '1932', title: 'Discovery of the Giant White Pine', description: 'A massive white pine that took seven horses to pull' },
  { year: '1935', title: 'Farm Expansion', description: 'Growing the agricultural operations' },
  { year: '1940s', title: 'War Years', description: 'Maintaining the farm during challenging times' },
  { year: '1942', title: 'White Barn Construction Begins', description: 'Using lumber from the giant white pine' },
  { year: '1945', title: 'Post-War Growth', description: 'Expanding after World War II' },
  { year: '1950', title: 'Family Traditions', description: 'Generations working the land together' },
  { year: '1952', title: 'White Barn Completed', description: 'The iconic barn finished after 10 years' },
  { year: '1955', title: 'Dairy Operations', description: 'Establishing the dairy farm' },
  { year: '1959', title: 'Harold Selmer Era', description: 'Harold takes over farm operations' },
  { year: '1960s', title: 'Modern Farming', description: 'Adopting new agricultural techniques' },
  { year: '1965', title: 'Community Gatherings', description: 'The barn becomes a community center' },
  { year: '1970', title: 'Third Generation', description: 'Family legacy continues' },
  { year: '1975', title: 'Farm Improvements', description: 'Modernizing facilities' },
  { year: '1980', title: 'Oak Forest Conservation', description: 'Preserving the mile-long oak forests' },
  { year: '1985', title: 'Vineyard Planted', description: 'Beginning grape cultivation' },
  { year: '1990', title: 'Sustainable Practices', description: 'Implementing eco-friendly farming' },
  { year: '1995', title: 'Heritage Preservation', description: 'Maintaining historical structures' },
  { year: '2000', title: 'New Millennium', description: 'Preparing for the next chapter' },
  { year: '2003', title: 'Harold Selmer Legacy', description: '44 years of dedicated farming' },
  { year: '2006', title: 'First Wedding Event', description: 'Beginning of event venue era' },
  { year: '2008', title: 'Venue Renovations', description: 'Transforming for celebrations' },
  { year: '2010', title: 'Growing Reputation', description: 'Becoming known for weddings' },
  { year: '2012', title: 'Landscape Development', description: 'Creating picturesque settings' },
  { year: '2015', title: 'Premier Venue Status', description: 'Recognized throughout Minnesota' },
  { year: '2018', title: 'Vineyard Maturity', description: 'Grapes flourishing on the hillside' },
  { year: '2020', title: 'Resilience', description: 'Adapting through challenges' },
  { year: '2022', title: 'Continued Excellence', description: 'Serving couples with dedication' },
  { year: '2024', title: 'Looking Forward', description: 'Creating memories for years to come' },
  { year: 'Today', title: 'Minnesota\'s Premier Barn Venue', description: 'Where dreams come true' },
];

export default function HistoryCarouselEditor({ blok }: HistoryCarouselProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const autoplay = Autoplay({
    delay: 5000,
    stopOnInteraction: false,
    playOnInit: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
      slidesToScroll: 1,
    },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const toggleAutoplay = useCallback(() => {
    const autoplayInstance = emblaApi?.plugins()?.autoplay;
    if (!autoplayInstance) return;

    const isPlaying = autoplayInstance.isPlaying();
    if (isPlaying) autoplayInstance.stop();
    else autoplayInstance.play();
    setIsPlaying(!isPlaying);
  }, [emblaApi]);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <section
      className="hotfix-history-section"
      {...storyblokEditable(blok)}
      data-discover="true"
    >
      <div className="hotfix-history-content">
        {/* Header */}
        <div className="hotfix-history-header">
          <div className="hotfix-script-accent">
            {blok.script_accent || 'Through the Years'}
          </div>
          <h2 className="hotfix-history-title">
            {blok.section_title || 'Historical Photo Gallery'}
          </h2>
          <p className="hotfix-history-lead">
            {blok.lead_text || 'Authentic photographs from the Selmer family archives spanning 100+ years'}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="hotfix-carousel-container">
          {/* Navigation Buttons */}
          <button
            className="hotfix-carousel-nav prev"
            onClick={scrollPrev}
            aria-label="Previous photos"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            className="hotfix-carousel-nav next"
            onClick={scrollNext}
            aria-label="Next photos"
          >
            <ChevronRight size={32} />
          </button>

          {/* Autoplay Toggle */}
          <button
            className="hotfix-autoplay-toggle"
            onClick={toggleAutoplay}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Embla Carousel - Shows 3 at a time */}
          <div className="hotfix-embla-viewport" ref={emblaRef}>
            <div className="hotfix-embla-container">
              {historyImages.map((imageUrl, index) => {
                const data = historicalData[index] || historicalData[0];

                return (
                  <div
                    key={index}
                    className="hotfix-embla-slide"
                  >
                    <div className="hotfix-history-card">
                      {/* Image with 5:4 aspect ratio */}
                      <div className="hotfix-history-image-wrapper">
                        <img
                          src={imageUrl}
                          alt={`${data.title} (${data.year})`}
                          className="hotfix-history-image"
                          loading="lazy"
                        />
                        {/* Subtle Gradient Overlay */}
                        <div className="hotfix-history-gradient" />
                      </div>

                      {/* Content */}
                      <div className="hotfix-history-card-content">
                        <h3 className="hotfix-history-card-title">
                          {data.title}
                        </h3>
                        <p className="hotfix-history-card-description">
                          {data.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Navigation - Sliding Window */}
          <div className="hotfix-timeline-container">
            <div className="hotfix-timeline-track">
              <div 
                className="hotfix-timeline-progress" 
                style={{ width: '50%', left: '25%' }}
              />
              {scrollSnaps.map((_, index) => {
                const data = historicalData[index] || historicalData[0];
                const isActive = index === selectedIndex;
                const distance = Math.abs(index - selectedIndex);
                const isInWindow = distance <= 5; // Only render dots within 5 positions
                
                if (!isInWindow) return null;
                
                // Calculate position relative to the visible window
                const relativePosition = ((index - selectedIndex + 5) / 10) * 100;
                
                return (
                  <button
                    key={index}
                    className={`hotfix-timeline-marker ${isActive ? 'active' : ''}`}
                    onClick={() => scrollTo(index)}
                    aria-label={`Go to ${data.year}`}
                    style={{ left: `${relativePosition}%` }}
                  >
                    <span className="hotfix-timeline-year">{data.year}</span>
                    <span className="hotfix-timeline-dot" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hotfix-history-section {
          padding: 5rem 2rem;
          background: #e8e6e3;
        }

        .hotfix-history-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .hotfix-history-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .hotfix-script-accent {
          font-family: 'Dancing Script', cursive;
          font-size: 1.5rem;
          color: #8b7355;
          margin-bottom: 0.5rem;
        }

        .hotfix-history-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #2c2c2c;
        }

        .hotfix-history-lead {
          font-size: 1.125rem;
          color: #666;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Carousel Container */
        .hotfix-carousel-container {
          position: relative;
          margin-top: 3rem;
          padding: 3rem 5rem 0;
        }

        /* Navigation Buttons - Outside Cards */
        .hotfix-carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(139, 115, 85, 0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          color: #8b7355;
          opacity: 0.5;
        }

        .hotfix-carousel-container:hover .hotfix-carousel-nav {
          opacity: 1;
        }

        .hotfix-carousel-nav:hover {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-50%) scale(1.1);
          color: #9D6B7B;
        }

        .hotfix-carousel-nav.prev {
          left: 1rem;
        }

        .hotfix-carousel-nav.next {
          right: 1rem;
        }

        /* Autoplay Toggle - Small and Subtle */
        .hotfix-autoplay-toggle {
          position: absolute;
          top: -2rem;
          right: 5rem;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 0.25rem;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          opacity: 0.3;
          width: 28px;
          height: 28px;
        }

        .hotfix-carousel-container:hover .hotfix-autoplay-toggle {
          opacity: 0.6;
        }

        .hotfix-autoplay-toggle:hover {
          background: rgba(255, 255, 255, 0.8);
          opacity: 1;
        }
        
        .hotfix-autoplay-toggle svg {
          width: 12px;
          height: 12px;
          color: #8b7355;
        }

        /* Embla Carousel */
        .hotfix-embla-viewport {
          overflow: hidden;
        }

        .hotfix-embla-container {
          display: flex;
          gap: 1rem;
        }

        .hotfix-embla-slide {
          flex: 0 0 calc(33.333% - 0.667rem);
          min-width: 320px;
          max-width: 380px;
        }


        /* History Card - Polaroid Style */
        .hotfix-history-card {
          background: #fafaf8;
          border-radius: 2px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          padding: 0.75rem 0.75rem 1.25rem;
          transform: rotate(-0.5deg);
        }

        .hotfix-embla-slide:nth-child(even) .hotfix-history-card {
          transform: rotate(0.5deg);
        }

        .hotfix-embla-slide:nth-child(3n) .hotfix-history-card {
          transform: rotate(-0.3deg);
        }

        .hotfix-history-card:hover {
          transform: rotate(0deg) translateY(-8px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2), 0 2px 5px rgba(0, 0, 0, 0.12);
        }

        /* Image with 5:4 aspect ratio - Polaroid Border */
        .hotfix-history-image-wrapper {
          position: relative;
          aspect-ratio: 5 / 4;
          overflow: hidden;
          background: white;
          border: 1px solid #f0f0f0;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
          width: 100%;
        }

        .hotfix-history-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: brightness(0.98) contrast(1.02);
        }

        .hotfix-history-card:hover .hotfix-history-image {
          transform: scale(1.05);
          filter: brightness(1) contrast(1.05);
        }

        .hotfix-history-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            transparent 60%,
            rgba(0, 0, 0, 0.05) 100%
          );
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .hotfix-history-card:hover .hotfix-history-gradient {
          opacity: 1;
        }

        /* Card Content - Polaroid Caption */
        .hotfix-history-card-content {
          padding: 1rem 0.5rem 0.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hotfix-history-card-title {
          font-family: 'Courier New', monospace;
          font-size: 0.95rem;
          font-weight: 600;
          color: #3a3a3a;
          margin-bottom: 0.4rem;
          line-height: 1.2;
          transition: color 0.3s ease;
          letter-spacing: -0.02em;
        }

        .hotfix-history-card:hover .hotfix-history-card-title {
          color: #8b7355;
        }

        .hotfix-history-card-description {
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          color: #666;
          line-height: 1.3;
          flex: 1;
          font-weight: 400;
          opacity: 0.8;
        }

        /* Timeline Navigation */
        .hotfix-timeline-container {
          margin-top: 3rem;
          padding: 3rem 0 2rem;
          position: relative;
          overflow: visible;
        }

        .hotfix-timeline-track {
          position: relative;
          height: 2px;
          background: rgba(139, 115, 85, 0.2);
          border-radius: 2px;
          margin: 0 auto;
          max-width: 80%;
        }

        .hotfix-timeline-progress {
          position: absolute;
          top: 0;
          height: 100%;
          background: linear-gradient(90deg, #8b7355 0%, #9D6B7B 100%);
          border-radius: 2px;
          opacity: 0.6;
        }

        .hotfix-timeline-marker {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          z-index: 1;
        }
        
        .hotfix-timeline-marker.active {
          z-index: 10;
        }

        .hotfix-timeline-year {
          font-size: 0.7rem;
          font-weight: 500;
          color: #8b7355;
          opacity: 0.5;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          white-space: nowrap;
          position: absolute;
          bottom: 100%;
          margin-bottom: 0.5rem;
          background: white;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        /* Active year is centered and prominent */
        .hotfix-timeline-marker.active .hotfix-timeline-year {
          opacity: 1;
          font-weight: 700;
          font-size: 1rem;
          color: #9D6B7B;
          transform: translateY(-5px) scale(1.2);
          padding: 0.35rem 0.75rem;
          box-shadow: 0 4px 12px rgba(157, 107, 123, 0.2);
          background: linear-gradient(to bottom, white, #fafaf8);
          margin-bottom: 0.8rem;
        }

        .hotfix-timeline-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ddd;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
        }

        .hotfix-timeline-marker:hover .hotfix-timeline-dot {
          width: 12px;
          height: 12px;
          background: #8b7355;
        }
        
        .hotfix-timeline-marker.active .hotfix-timeline-dot {
          width: 16px;
          height: 16px;
          background: #9D6B7B;
          box-shadow: 0 4px 12px rgba(157, 107, 123, 0.4);
          transform: translateY(-2px);
        }

        .hotfix-timeline-marker:hover .hotfix-timeline-year {
          opacity: 1;
          transform: translateY(0) scale(1.05);
        }

        /* Responsive: 2 slides on tablet */
        @media (max-width: 1024px) {
          .hotfix-embla-slide {
            flex: 0 0 calc(50% - 0.75rem);
          }

          .hotfix-history-title {
            font-size: 2rem;
          }

          .hotfix-carousel-container {
            padding: 2.5rem 3rem 0;
          }

          .hotfix-carousel-nav {
            width: 36px;
            height: 36px;
          }

          .hotfix-autoplay-toggle {
            right: 3rem;
          }
        }

        /* Responsive: 1 slide on mobile */
        @media (max-width: 640px) {
          .hotfix-history-section {
            padding: 3rem 1rem;
          }

          .hotfix-embla-slide {
            flex: 0 0 100%;
          }

          .hotfix-embla-container {
            gap: 1rem;
          }

          .hotfix-history-title {
            font-size: 1.75rem;
          }

          .hotfix-history-lead {
            font-size: 1rem;
          }

          .hotfix-carousel-nav {
            width: 40px;
            height: 40px;
          }

          .hotfix-carousel-nav.prev {
            left: 0.5rem;
          }

          .hotfix-carousel-nav.next {
            right: 0.5rem;
          }


          .hotfix-history-card-content {
            padding: 1.25rem;
          }

          .hotfix-history-card-title {
            font-size: 1.125rem;
          }

          .hotfix-history-card-description {
            font-size: 0.875rem;
          }

          /* Timeline on mobile */
          .hotfix-timeline-container {
            margin-top: 2rem;
            padding: 1.5rem 0;
          }

          .hotfix-timeline-year {
            font-size: 0.625rem;
            padding: 0.2rem 0.4rem;
          }

          .hotfix-timeline-marker.visible .hotfix-timeline-year {
            opacity: 0.5;
          }

          .hotfix-timeline-dot {
            width: 8px;
            height: 8px;
          }

          .hotfix-timeline-marker:hover .hotfix-timeline-dot,
          .hotfix-timeline-marker.active .hotfix-timeline-dot {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </section>
  );
}
