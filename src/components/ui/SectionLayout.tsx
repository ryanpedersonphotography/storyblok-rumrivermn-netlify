import Image from 'next/image'
import * as React from 'react'

/* ============================================================================
   SECTION LAYOUT COMPONENT
   - Content orchestration (header/title/lead/actions/media/grid)
   - Named layout patterns for common use cases
   - Declarative API with escape hatches via slots
   - Works with SectionShell for complete section composition
   ============================================================================ */

/** High-level canned layouts you'll reuse across pages */
export type LayoutVariant =
  | 'legacy-full-centered'
  | 'header-center-content-left'
  | 'header-center-content-center'
  | 'alternating-blocks'
  | 'home-hero-2024'
  | 'gallery-masonry'
  | 'zigzag-2col'
  | 'split-hero'
  | 'stats-3up'
  | 'pricing-3up'
  | 'experience-2col'

export type RailWidth = 'prose' | 'content' | 'wide' | 'full'
export type RailAlign = 'left' | 'center' | 'right'

export interface HeaderProps {
  kicker?: string // a.k.a. scriptAccent/eyebrow
  title?: React.ReactNode
  lead?: React.ReactNode
  align?: 'left' | 'center' | 'right'
  max?: RailWidth | 'none' // override clamp/prose
}

export interface ActionsProps {
  align?: 'start' | 'center' | 'end'
  gap?: 'sm' | 'md' | 'lg'
  stackAt?: 'sm' | 'md' | 'lg' // switch row→column
  children?: React.ReactNode
}

export interface RailsProps {
  headerWidth?: RailWidth
  contentWidth?: RailWidth
  align?: RailAlign // aligns rails to left/center/right origin
}

export interface GridProps {
  /** Declarative grid for content area */
  columns?: { base: 1; sm?: 1 | 2; md?: 1 | 2 | 3; lg?: 1 | 2 | 3 | 4 }
  gap?: 'xs' | 'sm' | 'md' | 'lg'
  rowHeight?: number | 'auto'
  useSubgrid?: boolean // try subgrid when supported
}

export interface MediaProps {
  src?: string
  alt?: string // only for <img> in content; not for bg
  placement?: 'left' | 'right' | 'behind'
  aspect?: '16/9' | '4/3' | '1/1' | 'auto'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  overlay?: 'none' | 'soft' | 'strong'
}

export interface SectionLayoutProps {
  variant?: LayoutVariant
  rails?: RailsProps
  header?: HeaderProps
  actions?: ActionsProps
  grid?: GridProps
  media?: MediaProps

  /** Slots for full control escape hatch */
  children?: React.ReactNode
  HeaderSlot?: React.ReactNode
  ContentSlot?: React.ReactNode
  ActionsSlot?: React.ReactNode
}

export function SectionLayout({
  variant = 'legacy-full-centered',
  rails = { headerWidth: 'content', contentWidth: 'content', align: 'center' },
  header,
  actions,
  grid = { columns: { base: 1, md: 2 }, gap: 'md', rowHeight: 'auto', useSubgrid: true },
  media,
  HeaderSlot,
  ContentSlot,
  ActionsSlot,
  children,
}: SectionLayoutProps) {
  // Determine header alignment based on variant or explicit props
  const headerAlign = header?.align ?? (rails.align === 'center' ? 'center' : 'left')

  // Determine actions alignment based on rails alignment
  const actionsAlign = actions?.align ?? (rails.align === 'center' ? 'center' : 'start')

  return (
    <div
      className="section-layout"
      data-variant={variant}
      data-hwidth={rails.headerWidth}
      data-cwidth={rails.contentWidth}
      data-ralign={rails.align}
      data-gridcols={JSON.stringify(grid.columns)}
      data-gridgap={grid.gap}
      data-rowh={grid.rowHeight}
      data-subgrid={grid.useSubgrid ? 'true' : undefined}
    >
      {/* Header */}
      {(header || HeaderSlot) && (
        <header
          className="section-layout__header"
          data-align={headerAlign}
          data-max={header?.max ?? 'prose'}
        >
          {HeaderSlot ?? (
            <>
              {header?.kicker && (
                <p className="section-layout__kicker">{header.kicker}</p>
              )}
              {header?.title && (
                <h2 className="section-layout__title">{header.title}</h2>
              )}
              {header?.lead && (
                <p className="section-layout__lead">{header.lead}</p>
              )}
            </>
          )}
        </header>
      )}

      {/* Media (if placement is 'behind', it goes before content) */}
      {media && media.src && media.placement === 'behind' && (
        <div
          className="section-layout__media"
          data-placement={media.placement}
          data-aspect={media.aspect}
          data-radius={media.radius}
        >
          <Image
            src={media.src}
            alt={media.alt || ''}
            fill
            sizes="100vw"
            className="section-layout__media-image"
            priority={media.placement === 'behind'}
          />
          {media.overlay && media.overlay !== 'none' && (
            <div
              className="section-layout__media-overlay"
              data-overlay={media.overlay}
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {/* Content rail */}
      {(children || ContentSlot) && (
        <div className="section-layout__content" data-variant={variant}>
          {ContentSlot ?? children}
        </div>
      )}

      {/* Media (if placement is left/right, it's in the content flow) */}
      {media && media.src && (media.placement === 'left' || media.placement === 'right') && (
        <div
          className="section-layout__media"
          data-placement={media.placement}
          data-aspect={media.aspect}
          data-radius={media.radius}
        >
          <Image
            src={media.src}
            alt={media.alt || ''}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="section-layout__media-image"
          />
          {media.overlay && media.overlay !== 'none' && (
            <div
              className="section-layout__media-overlay"
              data-overlay={media.overlay}
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {/* Actions */}
      {(actions?.children || ActionsSlot) && (
        <div
          className="section-layout__actions"
          data-align={actionsAlign}
          data-gap={actions?.gap ?? 'md'}
          data-stack-at={actions?.stackAt ?? 'md'}
        >
          {ActionsSlot ?? actions?.children}
        </div>
      )}
    </div>
  )
}

export default SectionLayout