import * as React from 'react'
import { PropsSlot } from '@/components/primitives/PropsSlot'
import type {
  Align,
  Width,
  Container,
  SectionHeaderProps,
  SectionSlots,
} from '@/components/ui/section-types'

export interface SectionLayoutProps extends Pick<SectionSlots, 'headerSlotProps' | 'contentSlotProps' | 'actionsSlotProps'> {
  container: Container
  align: Align
  headerWidth: Width
  contentWidth: Width
  header?: SectionHeaderProps
  actions?: React.ReactNode
  children?: React.ReactNode
  contentWrapper?: boolean
}

const LegacyWrapper: React.FC<{ enabled: boolean; children: React.ReactNode }> = ({ enabled, children }) =>
  enabled ? (
    <div className="content-wrapper" data-legacy-wrapper="true">
      {children}
    </div>
  ) : (
    <>{children}</>
  )

const SectionLayout: React.FC<SectionLayoutProps> = ({
  container,
  align,
  headerWidth,
  contentWidth,
  header,
  actions,
  children,
  contentWrapper = false,
  headerSlotProps,
  contentSlotProps,
  actionsSlotProps,
}) => {
  if (container === 'wrapper') {
    return (
      <div className="section__wrapper">
        {header ? (
          <header className="section__header" data-align={header.align ?? align}>
            {header.scriptAccent && <p className="section__script-accent">{header.scriptAccent}</p>}
            {header.title && <h2 className="section__title">{header.title}</h2>}
            {header.lead && <p className="section__lead">{header.lead}</p>}
          </header>
        ) : null}

        {children ? (
          <div className="section__content" data-align={align}>
            {children}
          </div>
        ) : null}

        {actions ? (
          <div className="section__actions" data-align={align}>
            {actions}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <LegacyWrapper enabled={contentWrapper}>
      {header ? (
        <div className="section__rail section__rail--header" data-width={headerWidth}>
          {headerSlotProps ? (
            <PropsSlot inject={headerSlotProps as any}>
              <header className="section__header" data-align={header.align ?? align}>
                {header.scriptAccent && <p className="section__script-accent">{header.scriptAccent}</p>}
                {header.title && <h2 className="section__title">{header.title}</h2>}
                {header.lead && <p className="section__lead">{header.lead}</p>}
              </header>
            </PropsSlot>
          ) : (
            <header className="section__header" data-align={header.align ?? align}>
              {header.scriptAccent && <p className="section__script-accent">{header.scriptAccent}</p>}
              {header.title && <h2 className="section__title">{header.title}</h2>}
              {header.lead && <p className="section__lead">{header.lead}</p>}
            </header>
          )}
        </div>
      ) : null}

      {children ? (
        <div className="section__rail section__rail--content" data-width={contentWidth}>
          {contentSlotProps ? (
            <PropsSlot inject={contentSlotProps as any}>
              <div className="section__content">{children}</div>
            </PropsSlot>
          ) : (
            <div className="section__content">{children}</div>
          )}
        </div>
      ) : null}

      {actions ? (
        <div className="section__rail section__rail--actions" data-width={headerWidth}>
          {actionsSlotProps ? (
            <PropsSlot inject={actionsSlotProps as any}>
              <div className="section__actions" data-align={align}>
                {actions}
              </div>
            </PropsSlot>
          ) : (
            <div className="section__actions" data-align={align}>
              {actions}
            </div>
          )}
        </div>
      ) : null}
    </LegacyWrapper>
  )
}

SectionLayout.displayName = 'SectionLayout'

export default React.memo(SectionLayout)
