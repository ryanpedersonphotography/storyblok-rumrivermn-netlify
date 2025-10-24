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
      align: 'center',
      skipSnaps: false,
      dragFree: false,
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

  const slides = blok.slides || [];

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
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            className="hotfix-carousel-nav next"
            onClick={scrollNext}
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>

          {/* Autoplay Toggle */}
          <button
            className="hotfix-autoplay-toggle"
            onClick={toggleAutoplay}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Embla Carousel */}
          <div className="hotfix-embla-viewport" ref={emblaRef}>
            <div className="hotfix-embla-container">
              {slides.map((slide) => {
                const imageUrl = typeof slide.image === 'string'
                  ? slide.image
                  : slide.image?.filename || 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&h=600&fit=crop&auto=format&q=80';

                return (
                  <div
                    key={slide._uid}
                    className="hotfix-embla-slide"
                    {...storyblokEditable(slide)}
                  >
                    <div className="hotfix-slide-inner">
                      {/* Image */}
                      <div className="hotfix-slide-image-wrapper">
                        <img
                          src={imageUrl}
                          alt={`${slide.title || 'Historical photo'} (${slide.year || ''})`}
                          className="hotfix-slide-image"
                          loading="lazy"
                        />
                        {/* Gradient Overlay */}
                        <div className="hotfix-slide-gradient" />

                        {/* Year Badge */}
                        <div className="hotfix-year-badge">
                          <span>{slide.year || '1914'}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="hotfix-slide-content">
                        <h3 className="hotfix-slide-title">
                          {slide.title || 'Historical Event'}
                        </h3>
                        <p className="hotfix-slide-description">
                          {slide.description || 'Historical description goes here...'}
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

          {/* Slide Counter */}
          <div className="hotfix-slide-counter">
            <span>
              {selectedIndex + 1} of {slides.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
