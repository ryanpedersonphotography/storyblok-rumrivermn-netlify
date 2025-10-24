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
                        {/* Gradient Overlay */}
                        <div className="hotfix-history-gradient" />

                        {/* Year Badge */}
                        <div className="hotfix-year-badge">
                          <span>{data.year}</span>
                        </div>
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

          {/* Progress Indicators */}
          <div className="hotfix-carousel-dots">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`hotfix-carousel-dot ${
                  index === selectedIndex ? 'active' : ''
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hotfix-history-section {
          padding: 5rem 2rem;
          background: #f9f9f9;
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
        }

        /* Navigation Buttons */
        .hotfix-carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          color: #2c2c2c;
        }

        .hotfix-carousel-nav:hover {
          background: white;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          transform: translateY(-50%) scale(1.05);
        }

        .hotfix-carousel-nav.prev {
          left: -28px;
        }

        .hotfix-carousel-nav.next {
          right: -28px;
        }

        /* Autoplay Toggle */
        .hotfix-autoplay-toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .hotfix-autoplay-toggle:hover {
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Embla Carousel */
        .hotfix-embla-viewport {
          overflow: hidden;
        }

        .hotfix-embla-container {
          display: flex;
          gap: 1.5rem;
        }

        .hotfix-embla-slide {
          flex: 0 0 calc(33.333% - 1rem);
          min-width: 0;
        }

        /* History Card */
        .hotfix-history-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .hotfix-history-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        /* Image with 5:4 aspect ratio */
        .hotfix-history-image-wrapper {
          position: relative;
          aspect-ratio: 5 / 4;
          overflow: hidden;
        }

        .hotfix-history-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .hotfix-history-card:hover .hotfix-history-image {
          transform: scale(1.05);
        }

        .hotfix-history-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.3) 40%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* Year Badge */
        .hotfix-year-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(139, 115, 85, 0.95);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          z-index: 2;
        }

        /* Card Content */
        .hotfix-history-card-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .hotfix-history-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .hotfix-history-card-description {
          font-size: 0.9375rem;
          color: #666;
          line-height: 1.6;
          flex: 1;
        }

        /* Progress Dots */
        .hotfix-carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .hotfix-carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ddd;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .hotfix-carousel-dot.active {
          background: #8b7355;
          width: 32px;
          border-radius: 5px;
        }

        /* Responsive: 2 slides on tablet */
        @media (max-width: 1024px) {
          .hotfix-embla-slide {
            flex: 0 0 calc(50% - 0.75rem);
          }

          .hotfix-history-title {
            font-size: 2rem;
          }

          .hotfix-carousel-nav {
            width: 48px;
            height: 48px;
          }

          .hotfix-carousel-nav.prev {
            left: -24px;
          }

          .hotfix-carousel-nav.next {
            right: -24px;
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

          .hotfix-year-badge {
            top: 0.75rem;
            right: 0.75rem;
            padding: 0.375rem 0.75rem;
            font-size: 0.8125rem;
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
        }
      `}</style>
    </section>
  );
}
