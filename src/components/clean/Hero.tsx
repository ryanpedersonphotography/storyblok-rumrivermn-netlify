import React from 'react';
import HeroPrimitive, { type HeroPrimitiveProps } from '@/components/primitive/HeroPrimitive';

/**
 * Adapter that preserves your current clean/Hero API (blok-driven)
 * and maps it to the pure primitives Hero.
 *
 * If your actual blok field names differ, adjust the mappings below.
 */
type CleanHeroProps = {
  // If your current component receives `blok`, keep it:
  blok?: {
    eyebrow?: string;
    title?: string;
    accent?: string;
    lead?: string;
    overlay?: 'none' | 'soft' | 'strong';
    height?: 'auto' | 'screen';
    align?: 'start' | 'center' | 'end';
    density?: 'compact' | 'normal' | 'airy';
    paddingY?: 'sm' | 'md' | 'lg' | 'xl';
    background_image?: { filename: string; alt?: string; focal_x?: string; focal_y?: string };
    primary_cta_label?: string;
    primary_cta_href?: string;
    secondary_cta_label?: string;
    secondary_cta_href?: string;
    show_scroll_indicator?: boolean;
  } | undefined;

  // Or if you already had a prop shape, keep it and map similarly.
} & Partial<HeroPrimitiveProps>;

export default function Hero({ blok }: CleanHeroProps) {
  const props: HeroPrimitiveProps = {
    eyebrow: blok?.eyebrow ?? '',
    title: blok?.title ?? 'Your Dream Wedding',
    accent: blok?.accent ?? '',
    lead: blok?.lead ?? '',
    overlay: (blok?.overlay as HeroPrimitiveProps['overlay']) ?? 'soft',
    height: (blok?.height as HeroPrimitiveProps['height']) ?? 'screen',
    align: (blok?.align as HeroPrimitiveProps['align']) ?? 'center',
    density: (blok?.density as HeroPrimitiveProps['density']) ?? 'normal',
    paddingY: (blok?.paddingY as HeroPrimitiveProps['paddingY']) ?? 'lg',
    image: blok?.background_image?.filename
      ? {
          src: blok.background_image.filename,
          alt: blok.background_image.alt,
          focalX: blok.background_image.focal_x,
          focalY: blok.background_image.focal_y,
          position: 'cover',
          attachment: 'fixed',
        }
      : undefined,
    primaryCta: blok?.primary_cta_label && blok?.primary_cta_href
      ? { label: blok.primary_cta_label, href: blok.primary_cta_href }
      : undefined,
    secondaryCta: blok?.secondary_cta_label && blok?.secondary_cta_href
      ? { label: blok.secondary_cta_label, href: blok.secondary_cta_href }
      : undefined,
    showScrollIndicator: Boolean(blok?.show_scroll_indicator),
  };

  return <HeroPrimitive {...props} />;
}
