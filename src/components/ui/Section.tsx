// src/components/ui/Section.tsx
import * as React from 'react';
import { cx } from '@/lib/react-interop';
import { PropsSlot } from '@/components/primitives/PropsSlot';
import type { AlignBlock } from './types';

export type Align = AlignBlock;  // for backwards compat
export type RailWidth = 'prose' | 'content' | 'wide' | 'full';
export type PaddingY = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
export type Background = 'surface' | 'tint-rose' | 'tint-sage' | 'dark-gradient' | 'image';
export type Tone = 'light' | 'dark' | 'auto';
export type Divider = 'none' | 'hairline' | 'thread-gold';
export type Overlay = 'none' | 'soft' | 'strong';
export type Height = 'auto' | 'screen';
export type Container = 'rails' | 'wrapper';

export type Variant =
  | 'legacy-full-centered'
  | 'centered'
  | 'header-center-content-left'
  | 'header-center-content-center'
  | 'alternating-blocks-luxe'
  | 'home-hero-2024'
  | 'right-rail'
  | 'left-rail';

export interface SectionHeaderProps {
  scriptAccent?: string;
  title?: string;
  lead?: string;
  align?: Align;
}

export interface SectionImageProps {
  src: string;
  alt?: string;
  attachment?: 'fixed' | 'scroll';
  position?: 'cover' | 'contain';
}

export interface SectionProps<TTag extends React.ElementType = 'section'>
  extends Omit<React.ComponentPropsWithoutRef<TTag>, 'as' | 'color'> {
  as?: TTag;

  /** Named preset or space-separated tokens (first token used to pick preset). */
  variant?: Variant | string | string[];

  // Layout rails
  align?: Align;
  /** @deprecated use headerWidth/contentWidth. Kept for migration. */
  width?: RailWidth;
  headerWidth?: RailWidth;
  contentWidth?: RailWidth;
  paddingY?: PaddingY;
  height?: Height;
  bleed?: boolean;
  /** @deprecated prefer contentWidth='wide'. Kept for migration. */
  wideRail?: boolean;

  container?: Container;
  wrapperMax?: string;
  wrapperGutter?: string;

  // Visuals
  background?: Background;
  tone?: Tone;
  divider?: Divider;
  image?: SectionImageProps;
  overlay?: Overlay;

  // Content
  header?: SectionHeaderProps;
  actions?: React.ReactNode;
  children?: React.ReactNode;

  // Optional slots & flags
  contentWrapper?: boolean;      // legacy inner wrapper helper
  containerQueries?: boolean;    // emits data-cq="on" for @container rules

  headerSlotProps?: React.HTMLAttributes<HTMLElement>;
  contentSlotProps?: React.HTMLAttributes<HTMLElement>;
  actionsSlotProps?: React.HTMLAttributes<HTMLElement>;
}

const PRESETS: Record<Variant, Partial<SectionProps>> = {
  'legacy-full-centered': {
    align: 'center',
    headerWidth: 'content',
    contentWidth: 'content',
    paddingY: 'xl',
    background: 'surface',
    tone: 'auto',
    divider: 'none',
  },
  centered: {
    align: 'center',
    headerWidth: 'prose',
    contentWidth: 'content',
    paddingY: 'lg',
    background: 'surface',
    tone: 'auto',
  },
  'header-center-content-left': {
    align: 'left',
    header: { align: 'center' },
    headerWidth: 'prose',
    contentWidth: 'content',
    paddingY: 'lg',
    background: 'surface',
    tone: 'auto',
  },
  'header-center-content-center': {
    align: 'center',
    header: { align: 'center' },
    headerWidth: 'prose',
    contentWidth: 'content',
    paddingY: 'lg',
    background: 'surface',
    tone: 'auto',
  },
  'alternating-blocks-luxe': {
    align: 'center',
    header: { align: 'center' },
    headerWidth: 'content',
    contentWidth: 'content',
    paddingY: 'fluid',
    background: 'tint-rose',
    tone: 'auto',
  },
  'home-hero-2024': {
    align: 'center',
    header: { align: 'center' },
    headerWidth: 'content',
    contentWidth: 'content',
    paddingY: 'xl',
    height: 'screen',
    bleed: true,
    background: 'dark-gradient',
    tone: 'dark',
    divider: 'thread-gold',
  },
  'right-rail': {
    align: 'right',
    header: { align: 'right' },
    headerWidth: 'prose',
    contentWidth: 'wide',
    paddingY: 'lg',
  },
  'left-rail': {
    align: 'left',
    header: { align: 'left' },
    headerWidth: 'prose',
    contentWidth: 'wide',
    paddingY: 'lg',
  },
};

function mergeHeader(a?: SectionHeaderProps, b?: SectionHeaderProps): SectionHeaderProps | undefined {
  if (!a && !b) return undefined;
  return {
    scriptAccent: b?.scriptAccent ?? a?.scriptAccent,
    title:        b?.title        ?? a?.title,
    lead:         b?.lead         ?? a?.lead,
    align:        b?.align        ?? a?.align,
  };
}

export const Section = React.forwardRef<HTMLElement, SectionProps>((props, ref) => {
  const {
    as,
    id,
    className,
    style,
    variant,

    // rails
    align,
    width,                 // deprecated
    headerWidth,
    contentWidth,
    paddingY,
    height = 'auto',
    bleed,
    wideRail,              // deprecated
    container = 'rails',
    wrapperMax,
    wrapperGutter,

    // visuals
    background,
    tone = 'auto',
    divider = 'none',
    image,
    overlay = 'none',

    // content
    header,
    actions,
    children,

    // helpers/slots
    contentWrapper = false,
    containerQueries = false,
    headerSlotProps,
    contentSlotProps,
    actionsSlotProps,

    ...rest
  } = props;

  // DEV deprecation messages
  if (process.env.NODE_ENV !== 'production') {
    if (typeof width !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('Section: `width` is deprecated. Use `headerWidth`/`contentWidth` instead.');
    }
    if (typeof wideRail !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('Section: `wideRail` is deprecated. Use `contentWidth="wide"` instead.');
    }
  }

  const Tag = (as || 'section') as React.ElementType;

  // Preset resolution
  const firstVariant =
    Array.isArray(variant) ? variant[0] : typeof variant === 'string' ? variant.split(/\s+/)[0] : undefined;
  const preset = firstVariant && PRESETS[firstVariant as Variant] ? PRESETS[firstVariant as Variant] : undefined;

  // Resolve layout + visuals
  const resolvedAlign        = align        ?? preset?.align        ?? 'center';
  const resolvedHeaderWidth  = headerWidth  ?? preset?.headerWidth  ?? (width ?? 'content');
  const resolvedContentWidth = contentWidth ?? preset?.contentWidth ?? ((wideRail ? 'wide' : undefined) ?? (width ?? 'content'));
  const resolvedPaddingY     = paddingY     ?? preset?.paddingY     ?? 'md';
  const resolvedHeight       = height       ?? preset?.height       ?? 'auto';
  const resolvedBleed        = typeof bleed === 'boolean' ? bleed : (preset?.bleed ?? false);
  // Map legacy 'dark-gradient' background to a recipe-friendly data value
  const resolvedBackground   = (background ?? preset?.background ?? 'surface') as Background;
  const resolvedTone         = tone         ?? preset?.tone         ?? 'auto';
  const resolvedDivider      = divider      ?? preset?.divider      ?? 'none';
  const resolvedHeader       = mergeHeader(preset?.header, header);

  // Inline style only for bg image + wrapper custom props (tokens handled by CSS)
  const sectionStyle: React.CSSProperties = {
    ...style,
    ...(wrapperMax && { ['--wrapper-max' as any]: wrapperMax }),
    ...(wrapperGutter && { ['--wrapper-gutter' as any]: wrapperGutter }),
    ...(image && {
      backgroundImage: `url(${image.src})`,
      backgroundAttachment: image.attachment || 'scroll',
      backgroundSize: image.position || 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }),
  };

  // Data attributes = recipe contract
  const variantAttr = Array.isArray(variant) ? variant.filter(Boolean).join(' ') : (variant || undefined);
  const dataAttrs = {
    'data-section': 'unified',
    'data-variant': variantAttr,
    'data-align': resolvedAlign,
    'data-hwidth': resolvedHeaderWidth,
    'data-cwidth': resolvedContentWidth,
    'data-padding-y': resolvedPaddingY,
    'data-height': resolvedHeight,
    'data-bg': resolvedBackground === 'dark-gradient' ? 'dark' : resolvedBackground,
    'data-tone': resolvedTone,
    'data-divider': resolvedDivider,
    'data-overlay': image ? overlay : undefined,
    'data-bleed': resolvedBleed ? 'true' : undefined,
    'data-container': container,
    'data-cq': containerQueries ? 'on' : undefined,
  } as Record<string, string | undefined>;

  const rootClass = cx('section', className);

  const LegacyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    contentWrapper ? (
      <div className="content-wrapper" data-legacy-wrapper="true">
        {children}
      </div>
    ) : (
      <>{children}</>
    );

  return (
    <Tag id={id} ref={ref as any} className={rootClass} style={sectionStyle} {...dataAttrs} {...rest}>
      {/* Image overlay layer (rendered behind rails) */}
      {image && overlay !== 'none' && (
        <div className="section__overlay" data-overlay={overlay} aria-hidden="true" />
      )}

      {container === 'wrapper' ? (
        <div className="section__wrapper">
          {resolvedHeader && (
            <header className="section__header" data-align={resolvedHeader.align ?? resolvedAlign} {...headerSlotProps}>
              {resolvedHeader.scriptAccent && <p className="section__script-accent">{resolvedHeader.scriptAccent}</p>}
              {resolvedHeader.title && <h2 className="section__title">{resolvedHeader.title}</h2>}
              {resolvedHeader.lead && <p className="section__lead">{resolvedHeader.lead}</p>}
            </header>
          )}

          {children && (
            <div className="section__content" data-align={resolvedAlign} {...contentSlotProps}>
              {children}
            </div>
          )}

          {actions && (
            <div className="section__actions" data-align={resolvedAlign} {...actionsSlotProps}>
              {actions}
            </div>
          )}
        </div>
      ) : (
        <LegacyWrapper>
          {/* HEADER RAIL */}
          {resolvedHeader && (
            <div className="section__rail section__rail--header" data-width={resolvedHeaderWidth}>
              {headerSlotProps ? (
                <PropsSlot inject={headerSlotProps as any}>
                  <header className="section__header" data-align={resolvedHeader.align ?? resolvedAlign}>
                    {resolvedHeader.scriptAccent && <p className="section__script-accent">{resolvedHeader.scriptAccent}</p>}
                    {resolvedHeader.title && <h2 className="section__title">{resolvedHeader.title}</h2>}
                    {resolvedHeader.lead && <p className="section__lead">{resolvedHeader.lead}</p>}
                  </header>
                </PropsSlot>
              ) : (
                <header className="section__header" data-align={resolvedHeader.align ?? resolvedAlign}>
                  {resolvedHeader.scriptAccent && <p className="section__script-accent">{resolvedHeader.scriptAccent}</p>}
                  {resolvedHeader.title && <h2 className="section__title">{resolvedHeader.title}</h2>}
                  {resolvedHeader.lead && <p className="section__lead">{resolvedHeader.lead}</p>}
                </header>
              )}
            </div>
          )}

          {/* CONTENT RAIL */}
          {children && (
            <div className="section__rail section__rail--content" data-width={resolvedContentWidth}>
              {contentSlotProps ? (
                <PropsSlot inject={contentSlotProps as any}>
                  <div className="section__content">{children}</div>
                </PropsSlot>
              ) : (
                <div className="section__content">{children}</div>
              )}
            </div>
          )}

          {/* ACTIONS RAIL */}
          {actions && (
            <div className="section__rail section__rail--actions" data-width={resolvedHeaderWidth}>
              {actionsSlotProps ? (
                <PropsSlot inject={actionsSlotProps as any}>
                  <div className="section__actions" data-align={resolvedAlign}>
                    {actions}
                  </div>
                </PropsSlot>
              ) : (
                <div className="section__actions" data-align={resolvedAlign}>
                  {actions}
                </div>
              )}
            </div>
          )}
        </LegacyWrapper>
      )}

      {/* Divider */}
      {resolvedDivider !== 'none' && (
        <div className="section__divider" data-divider={resolvedDivider} aria-hidden="true" />
      )}
    </Tag>
  );
});
Section.displayName = 'Section';

export default Section;
