import * as React from 'react'
import { cx } from '@/lib/react-interop'
import type { SectionImageProps } from '@/components/ui/section-types'

export type SurfaceProps<TTag extends React.ElementType = 'section'> = Omit<
  React.ComponentPropsWithoutRef<TTag>,
  'as' | 'className' | 'style'
> & {
  as?: TTag
  className?: string
  style?: React.CSSProperties
  overlay?: 'none' | 'soft' | 'strong'
  image?: SectionImageProps
  dataAttributes?: Record<string, string | undefined>
  children?: React.ReactNode
}

type SurfaceComponent = <TTag extends React.ElementType = 'section'>(
  props: SurfaceProps<TTag> & { ref?: React.Ref<HTMLElement> }
) => React.ReactElement | null

const SurfaceInner = React.forwardRef<HTMLElement, SurfaceProps>(function Surface(
  props,
  ref
) {
  const {
    as,
    className,
    style,
    overlay = 'none',
    image,
    dataAttributes,
    children,
    ...rest
  } = props

  const Tag = (as || 'section') as React.ElementType

  const backgroundStyles: React.CSSProperties | undefined = image
    ? {
        backgroundImage: `url(${image.src})`,
        backgroundAttachment: image.attachment || 'scroll',
        backgroundSize: image.position || 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : undefined

  const mergedStyle = {
    ...style,
    ...backgroundStyles,
  }

  return (
    <Tag
      ref={ref as any}
      className={cx('section', className)}
      style={mergedStyle}
      {...dataAttributes}
      {...rest}
    >
      {image && overlay !== 'none' ? (
        <div className="section__overlay" data-overlay={overlay} aria-hidden="true" />
      ) : null}
      {children}
    </Tag>
  )
})

SurfaceInner.displayName = 'Surface'

export default SurfaceInner as SurfaceComponent
