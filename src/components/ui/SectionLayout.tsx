/* ========================================================================
   FILE: src/components/ui/SectionLayout.tsx
   PURPOSE: Content orchestration (header/content/actions/media/grid)
   - No theme logic; emits classes + data-attrs + CSS variables
   - Grid is exposed via CSS vars for recipes to consume (not JSON strings)
   ======================================================================== */
import * as React from 'react'

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
export type Overlay = 'none' | 'soft' | 'strong'
export type MediaPlacement = 'left' | 'right' | 'behind'

export interface HeaderProps {
  kicker?: string
  title?: React.ReactNode
  lead?: React.ReactNode
  align?: 'left' | 'center' | 'right'
  max?: RailWidth | 'none'
}

export interface ActionsProps {
  align?: 'start' | 'center' | 'end'
  gap?: 'sm' | 'md' | 'lg'
  stackAt?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export interface RailsProps {
  headerWidth?: RailWidth
  contentWidth?: RailWidth
  align?: RailAlign
}

export interface GridProps {
  columns?: { base: number; sm?: number; md?: number; lg?: number; xl?: number }
  gap?: 'xs' | 'sm' | 'md' | 'lg'
  rowHeight?: number | 'auto'
  useSubgrid?: boolean
}

export interface MediaProps {
  src?: string
  alt?: string
  placement?: MediaPlacement
  aspect?: '16/9' | '4/3' | '1/1' | 'auto'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  overlay?: Overlay
}

export interface SectionLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LayoutVariant
  rails?: RailsProps
  header?: HeaderProps
  actions?: ActionsProps
  grid?: GridProps
  media?: MediaProps

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
  style,
  className = '',
  ...rest
}: SectionLayoutProps) {
  // Header + actions alignment derived from rails unless explicitly set
  const headerAlign = header?.align ?? (rails.align === 'center' ? 'center' : 'left')
  const actionsAlign = actions?.align ?? (rails.align === 'center' ? 'center' : 'start')

  // Expose grid as CSS variables (recipes read these)
  const gridVars: React.CSSProperties = {
    ['--grid-cols-base' as any]: (grid.columns?.base ?? 1).toString(),
    ...(grid.columns?.sm ? { ['--grid-cols-sm' as any]: grid.columns.sm.toString() } : null),
    ...(grid.columns?.md ? { ['--grid-cols-md' as any]: grid.columns.md.toString() } : null),
    ...(grid.columns?.lg ? { ['--grid-cols-lg' as any]: grid.columns.lg.toString() } : null),
    ...(grid.columns?.xl ? { ['--grid-cols-xl' as any]: grid.columns.xl.toString() } : null),
    ...(grid.rowHeight && grid.rowHeight !== 'auto'
      ? { ['--grid-row-h' as any]: `${grid.rowHeight}px` }
      : { ['--grid-row-h' as any]: 'auto' }),
  }

  return (
    <div
      className={`section-layout ${className}`.trim()}
      style={{ ...style, ...gridVars }}
      data-variant={variant}
      data-hwidth={rails.headerWidth}
      data-cwidth={rails.contentWidth}
      data-ralign={rails.align}
      data-gridgap={grid.gap}
      data-subgrid={grid.useSubgrid ? 'true' : undefined}
      {...rest}
    >
      {(header || HeaderSlot) && (
        <header
          className="section-layout__header"
          data-align={headerAlign}
          data-max={header?.max ?? 'prose'}
        >
          {HeaderSlot ?? (
            <>
              {header?.kicker && <p className="section-layout__kicker">{header.kicker}</p>}
              {header?.title && <h2 className="section-layout__title">{header.title}</h2>}
              {header?.lead && <p className="section-layout__lead">{header.lead}</p>}
            </>
          )}
        </header>
      )}

      {/* Media 'behind' renders before content so overlay can sit beneath */}
      {media && media.placement === 'behind' && (
        <div
          className="section-layout__media"
          data-placement={media.placement}
          data-aspect={media.aspect}
          data-radius={media.radius}
        >
          {media.src && <img src={media.src} alt={media.alt || ''} />}
          {media.overlay && media.overlay !== 'none' && (
            <div className="section-layout__media-overlay" data-overlay={media.overlay} aria-hidden="true" />
          )}
        </div>
      )}

      {(children || ContentSlot) && (
        <div className="section-layout__content" data-variant={variant}>
          {ContentSlot ?? children}
        </div>
      )}

      {media && (media.placement === 'left' || media.placement === 'right') && (
        <div
          className="section-layout__media"
          data-placement={media.placement}
          data-aspect={media.aspect}
          data-radius={media.radius}
        >
          {media.src && <img src={media.src} alt={media.alt || ''} />}
          {media.overlay && media.overlay !== 'none' && (
            <div className="section-layout__media-overlay" data-overlay={media.overlay} aria-hidden="true" />
          )}
        </div>
      )}

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
