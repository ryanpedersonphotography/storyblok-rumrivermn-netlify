'use client';

import { storyblokEditable } from '@storyblok/react';

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
      case 'parking':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-3.5m-9.75 0H15m-7.5 0h3m-3.75 0h.375c.621 0 1.125-.504 1.125-1.125V9.75c0-.621-.504-1.125-1.125-1.125H6.75a1.125 1.125 0 0 0-1.125 1.125v1.125c0 .621.504 1.125 1.125 1.125Zm10.5-11.25h.375c.621 0 1.125.504 1.125 1.125v7.5c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125v-7.5c0-.621.504-1.125 1.125-1.125h9.75Z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hotfix-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
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
  const currentItems = blok.location_items || [];

  // Helper function to trim content and titles to 2 words max
  const trimContent = (iconType: string, originalContent: string): string => {
    const contentMap: { [key: string]: string } = {
      'address': '42618 78th Street\\nHillman, MN 56338',
      'access': '45 min from\\nMinneapolis',
      'airport': 'MSP International\\n55 miles away',
      'accommodations': 'Partner hotels\\nGroup rates'
    };
    return contentMap[iconType] || originalContent;
  };

  const trimTitle = (iconType: string, originalTitle: string): string => {
    const titleMap: { [key: string]: string } = {
      'address': 'Address',
      'access': 'Easy Access',
      'airport': 'Nearest Airport',
      'accommodations': 'Accommodations'
    };
    return titleMap[iconType] || originalTitle;
  };

  // Add 2 new items for balanced 6-item layout
  const parkingItem: LocationItemProps = {
    _uid: 'temp_parking',
    component: 'location_item',
    icon_type: 'parking',
    title: 'Free Parking',
    content: 'On-site parking\\n150+ vehicles'
  };

  const yearRoundItem: LocationItemProps = {
    _uid: 'temp_yearround',
    component: 'location_item',
    icon_type: 'calendar',
    title: 'Year-Round',
    content: 'All seasons\\navailable'
  };

  // Trim existing items titles and content, then reorder
  const trimmedItems = currentItems.map(item => ({
    ...item,
    title: trimTitle(item.icon_type || '', item.title || ''),
    content: trimContent(item.icon_type || '', item.content || '')
  }));

  // Reorder: Address, Parking, Airport, Easy Access, Year-Round, Accommodations
  const filteredLocationItems = trimmedItems.length >= 4 ? [
    trimmedItems[0], // Address
    parkingItem,     // NEW - Position 2 (Middle Left)
    trimmedItems[2], // Nearest Airport
    trimmedItems[1], // Easy Access From
    yearRoundItem,   // NEW - Position 5 (Middle Right)
    trimmedItems[3], // Accommodations
  ] : currentItems;

  return (
      <section
        className="hotfix-map-section"
        data-section="map"
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

        {/* Content Grid - Direct children for proper grid placement */}
        <div className="hotfix-map-content-grid">
          {/* Items 1-3: Left column */}
          {filteredLocationItems.slice(0, 3).map((item) => (
            <LocationItem blok={item} key={item._uid} />
          ))}

          {/* Circular Map - Center column, spans 3 rows */}
          <div className="hotfix-map-embed">
            <iframe
              src={blok.map_embed_url || 'https://www.google.com/maps?q=45.8936111,-93.7851842&hl=en&z=14&output=embed'}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rum River Barn Location - 42618 78th Street, Hillman, MN 56338"
            />
          </div>

          {/* Items 4-6: Right column */}
          {filteredLocationItems.slice(3, 6).map((item) => (
            <LocationItem blok={item} key={item._uid} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { LocationItem };
