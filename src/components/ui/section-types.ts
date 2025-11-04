import * as React from 'react'

export type Align = 'left' | 'center' | 'right'
export type Width = 'prose' | 'content' | 'wide' | 'full'
export type PaddingY = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fluid'
export type Background = 'surface' | 'tint-rose' | 'tint-sage' | 'dark-gradient' | 'image'
export type Tone = 'light' | 'dark' | 'auto'
export type Divider = 'none' | 'hairline' | 'thread-gold'
export type Height = 'auto' | 'screen'
export type Container = 'rails' | 'wrapper'

/** Named, easy-to-remember layout presets. */
export type Variant =
  | 'legacy-full-centered'
  | 'centered'
  | 'header-center-content-left'
  | 'header-center-content-center'
  | 'alternating-blocks-luxe'
  | 'home-hero-2024'
  | 'right-rail'
  | 'left-rail'

export interface SectionHeaderProps {
  scriptAccent?: string
  title?: string
  lead?: string
  align?: Align
}

export interface SectionImageProps {
  src: string
  alt?: string
  attachment?: 'fixed' | 'scroll'
  position?: 'cover' | 'contain'
}

export interface SectionSlots {
  headerSlotProps?: React.HTMLAttributes<HTMLElement>
  contentSlotProps?: React.HTMLAttributes<HTMLElement>
  actionsSlotProps?: React.HTMLAttributes<HTMLElement>
}
