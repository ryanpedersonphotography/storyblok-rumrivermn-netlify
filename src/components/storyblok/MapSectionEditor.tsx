'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import { useEffect, useRef } from 'react';

interface LocationItemProps {
  _uid: string;
  component: string;
  icon_type?: string;
  title?: string;
  content?: string;
  [key: string]: any;
}

interface MapSectionProps {
  blok: {
    _uid: string;
    component: string;
    script_accent?: string;
    section_title?: string;
    lead_text?: string;
    location_items?: LocationItemProps[];
    map_embed_url?: string;
    directions_url?: string;
    full_map_url?: string;
    [key: string]: any;
  };
}

function LocationItem({ blok }: { blok: LocationItemProps }) {
  // Icon SVG based on icon_type
  const renderIcon = () => {
    switch (blok.icon_type) {
      case 'address':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        );
      case 'access':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        );
      case 'airport':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
          </svg>
        );
      case 'accommodations':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        );
    }
  };

  // Convert \n to <br> for content display
  const formatContent = (content: string) => {
    return content.split('\\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="hotfix-location-item" {...storyblokEditable(blok)}>
      <div className="hotfix-location-icon">
        {renderIcon()}
      </div>
      <div className="hotfix-location-text">
        <h4>{blok.title || 'Location Detail'}</h4>
        <p>{blok.content ? formatContent(blok.content) : ''}</p>
      </div>
    </div>
  );
}

export default function MapSectionEditor({ blok }: MapSectionProps) {
  // Show all location items (address, access, airport, accommodations)
  const filteredLocationItems = blok.location_items || [];
  const mapEmbedRef = useRef<HTMLDivElement>(null);

  // Add overlay to hide Google Maps place card
  useEffect(() => {
    if (!mapEmbedRef.current) return;

    // Create overlay div to cover place card
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.bottom = '70px';
    overlay.style.left = '15px';
    overlay.style.width = '360px';
    overlay.style.height = '160px';
    overlay.style.backgroundColor = 'rgba(122, 139, 127, 0.98)';
    overlay.style.borderRadius = '8px';
    overlay.style.zIndex = '15';
    overlay.style.pointerEvents = 'none';
    overlay.className = 'place-card-cover';

    mapEmbedRef.current.appendChild(overlay);

    // Cleanup on unmount
    return () => {
      if (mapEmbedRef.current && overlay.parentNode === mapEmbedRef.current) {
        mapEmbedRef.current.removeChild(overlay);
      }
    };
  }, []);

  return (
    <section
      className="hotfix-map-section"
      {...storyblokEditable(blok)}
      data-discover="true"
    >
      <div className="hotfix-map-container">
        {/* Section Header - Full Width */}
        <div className="hotfix-map-section-header">
          <div className="hotfix-script-accent">
            {blok.script_accent || 'Interactive Location'}
          </div>
          <h2 className="hotfix-map-section-title">
            {blok.section_title || 'Find Your Way to Forever'}
          </h2>
          <p className="hotfix-map-section-lead">
            {blok.lead_text || 'Nestled in the heart of Minnesota, where your love story unfolds in perfect harmony.'}
          </p>
        </div>

        {/* Content Grid */}
        <div className="hotfix-map-content-grid">
          {/* Left Panel - Location Information */}
          <div className="hotfix-map-info">
            <div className="hotfix-location-details">
              {filteredLocationItems.map((item) => (
                <LocationItem blok={item} key={item._uid} />
              ))}
            </div>
          </div>

          {/* Right Panel - Interactive Map */}
          <div className="hotfix-map-embed" ref={mapEmbedRef}>
            <iframe
              src={blok.map_embed_url || 'https://www.google.com/maps?q=45.8936111,-93.7851842&hl=en&z=14&output=embed'}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rum River Barn Location - 42618 78th Street, Hillman, MN 56338"
            />

            <div className="hotfix-map-overlay">
              <a
                href={blok.directions_url || 'https://www.google.com/maps/dir//42618+78th+Street,+Hillman,+MN+56338'}
                target="_blank"
                rel="noopener noreferrer"
                className="hotfix-map-action-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon-sm">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                Get Directions
              </a>
              <a
                href={blok.full_map_url || 'https://www.google.com/maps/place/42618+78th+St,+Hillman,+MN+56338'}
                target="_blank"
                rel="noopener noreferrer"
                className="hotfix-map-action-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon-sm">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                Full Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { LocationItem };
