'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/solid'

export default function HistoryCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoplayOn, setIsAutoplayOn] = useState(true)

  const slides = [
    {
      year: '2010',
      title: 'The Beginning',
      description: 'From a vision to reality, Rum River Barn opened its doors to couples seeking a rustic yet elegant wedding venue in the heart of Minnesota.',
      image: 'https://a.storyblok.com/f/288003/1600x1000/a1b2c3d4e5/history-2010.jpg'
    },
    {
      year: '2015',
      title: 'Expansion & Growth',
      description: 'As word spread about our stunning venue and exceptional service, we expanded our facilities to accommodate larger celebrations while maintaining our intimate charm.',
      image: 'https://a.storyblok.com/f/288003/1600x1000/b2c3d4e5f6/history-2015.jpg'
    },
    {
      year: '2018',
      title: 'Award Recognition',
      description: 'Honored to be featured in Minnesota Bride and recognized by The Knot as a top wedding venue. Our couples\' joy became our greatest achievement.',
      image: 'https://a.storyblok.com/f/288003/1600x1000/c3d4e5f6g7/history-2018.jpg'
    },
    {
      year: '2024',
      title: 'A Decade of Love',
      description: 'Over 10 years and hundreds of weddings later, we continue to create unforgettable moments for couples. Thank you for making Rum River Barn your choice.',
      image: 'https://a.storyblok.com/f/288003/1600x1000/d4e5f6g7h8/history-2024.jpg'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoplay = () => {
    setIsAutoplayOn(!isAutoplayOn);
  };

  return (
    <section className="history">
      <div className="history__content">
        <div className="history__header">
          <span className="history__script">Our Story</span>
          <h2 className="history__title">A Journey Through Time</h2>
          <p className="history__lead">
            Discover how Rum River Barn became Minnesota's premier wedding destination
          </p>
        </div>

        <div className="history__carousel">
          <div className="history__viewport">
            <div
              className="history__container"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                transition: 'transform 0.5s ease-in-out'
              }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="history__slide">
                  <div className="history__slide-inner">
                    <div className="history__image-wrapper">
                      <img
                        src={slide.image}
                        alt={`${slide.title} - ${slide.year}`}
                        className="history__image"
                        width="1600"
                        height="1000"
                      />
                      <div className="history__gradient"></div>

                      <div className="history__badge">
                        <span>{slide.year}</span>
                      </div>

                      <div className="history__text">
                        <h3 className="history__slide-title">{slide.title}</h3>
                        <p className="history__slide-description">{slide.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            className="history__nav history__nav--prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            className="history__nav history__nav--next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Autoplay Toggle */}
          <button
            className="history__autoplay"
            onClick={toggleAutoplay}
            aria-label={isAutoplayOn ? 'Pause autoplay' : 'Resume autoplay'}
          >
            {isAutoplayOn ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Progress Dots */}
        <div className="history__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`history__dot ${index === currentSlide ? 'history__dot--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="history__counter">
          <span>
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>
    </section>
  );
}
