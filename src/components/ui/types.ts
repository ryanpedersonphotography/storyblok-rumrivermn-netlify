/* ==========================================================================
   SHARED UI PRIMITIVE TYPES

   Centralized type definitions used across multiple primitive components.
   Prevents type drift and ensures consistent APIs.
   ========================================================================== */

/**
 * Block-level alignment (for sections, containers, rails)
 * Used by: Section, SectionShell, SectionLayout
 */
export type AlignBlock = 'left' | 'center' | 'right'

/**
 * Text flow alignment (for typography, inline content)
 * Used by: Heading, Text
 */
export type AlignText = 'start' | 'center' | 'end'

/** @deprecated Use AlignText for text or AlignBlock for sections */
export type Align = AlignText
