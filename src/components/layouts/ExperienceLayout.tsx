import React from 'react'
import Section from '@/components/ui/SectionEnhanced'
import type { SectionProps, Background, Tone, PaddingY, Divider } from '@/components/ui/SectionEnhanced'

interface ExperienceLayoutProps {
  children: React.ReactNode
  
  // Header configuration from Storyblok
  header?: {
    scriptAccent?: string
    title?: string
    lead?: string
  }
  
  // Design customization (kept in code for consistency)
  background?: Background
  tone?: Tone
  paddingY?: PaddingY
  divider?: Divider
  useContentWrapper?: boolean
  
  // HTML attributes
  className?: string
  id?: string
  
  // Pass through Storyblok and other props
  [key: string]: any
}

/**
 * ExperienceLayout - Layout component for Experience sections
 * 
 * Design Philosophy:
 * - Clean, professional background (surface)
 * - Extra padding for breathing room
 * - Content wrapper for readability
 * - Centered alignment for focus
 * 
 * Storyblok Integration:
 * - Receives content via header prop
 * - Spreads storyblokEditable for visual editing
 * - Styling remains in code for consistency
 */
export default function ExperienceLayout({ 
  children, 
  header,
  
  // Design props with defaults for Experience section
  background = 'surface',     // Clean, professional
  tone = 'auto',              
  paddingY = 'xl',            // Extra breathing room
  divider = 'none',           
  useContentWrapper = true,   // Consistent width
  
  // HTML props
  className = '',
  id = 'experience',
  
  // Rest includes storyblokEditable props
  ...rest 
}: ExperienceLayoutProps) {
  
  // Build header with defaults
  const resolvedHeader = header ? {
    scriptAccent: header.scriptAccent || 'The Rum River Experience',
    title: header.title || 'More Than a Venue',
    lead: header.lead || 'Where your dreams become unforgettable memories',
    align: 'center' as const
  } : undefined

  // Build section props
  const sectionProps: SectionProps = {
    as: 'section',
    id,
    align: 'center',
    
    // Design configuration
    background,
    tone,
    paddingY,
    divider,
    
    // Layout configuration
    contentWrapper: useContentWrapper,
    
    // Header
    header: resolvedHeader,
    
    // Enhanced features
    headerSlotProps: {
      'data-test-id': `${id}-header`,
      style: { scrollMarginTop: '80px' }
    },
    contentSlotProps: {
      'data-test-id': `${id}-content`,
      'aria-label': 'Venue experience and features'
    },
    
    // Classes
    className: `rum-river-experience ${className}`.trim(),
    
    // Pass through Storyblok editable props
    ...rest
  }

  return (
    <Section {...sectionProps}>
      {children}
    </Section>
  )
}