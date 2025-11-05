"use client"

import * as React from 'react'
import { usePathname } from 'next/navigation'
import {
  Squares2X2Icon,
  SparklesIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { cx } from '@/lib/react-interop'
import '@/styles/components/glass-toolbar.css'
import ThemeToggle from '@/components/ThemeToggle'

type ToolbarItem = {
  id: string
  label: string
  description?: string
}

type ToolbarSection = {
  id: string
  label: string
  description?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  items?: ToolbarItem[]
}

type GlassToolbarProps = {
  sections?: ToolbarSection[]
  activeSectionId?: string
  onSectionChange?: (sectionId: string) => void
  onItemSelect?: (sectionId: string, itemId: string) => void
  initialExpanded?: boolean
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_SECTIONS: ToolbarSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Snapshot and quick links',
    icon: Squares2X2Icon,
    items: [
      { id: 'activity', label: 'Activity' },
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'insights', label: 'Insights' },
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    description: 'Curate on-site journey',
    icon: SparklesIcon,
    items: [
      { id: 'timeline', label: 'Timeline' },
      { id: 'storyboard', label: 'Storyboard' },
      { id: 'touchpoints', label: 'Touchpoints' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Themes, tokens, and scripts',
    icon: Cog6ToothIcon,
    items: [
      { id: 'integrations', label: 'Integrations' },
      { id: 'theme', label: 'Theme Tokens' },
      { id: 'labs', label: 'Labs' },
    ],
  },
  {
    id: 'devtools',
    label: 'Dev Tools',
    description: 'Experiments & utilities',
    icon: CommandLineIcon,
  },
]

const PANEL_VARIANTS_EXPRESSIVE: Variants = {
  collapsed: {
    x: '-100%',
    opacity: 0,
    boxShadow: 'none',
    pointerEvents: 'none',
    transition: {
      type: 'tween',
      ease: [0.4, 0.0, 0.2, 1.0],
      duration: 0.335,
      delay: 0.04,
      opacity: { ease: [0.4, 0.0, 0.2, 1.0], duration: 0.23, delay: 0.085 },
    },
    transitionEnd: { pointerEvents: 'none' },
  },
  expanded: {
    x: '0%',
    opacity: 1,
    boxShadow: 'var(--glass-toolbar-shadow)',
    pointerEvents: 'auto',
    transition: {
      type: 'spring',
      stiffness: 308,
      damping: 43,
      bounce: 0,
      restDelta: 0.5,
      restSpeed: 0.5,
      delay: 0.06,
    },
    transitionEnd: { pointerEvents: 'auto' },
  },
}

const PANEL_VARIANTS_REDUCED: Variants = {
  collapsed: {
    x: '-100%',
    opacity: 0,
    boxShadow: 'none',
    pointerEvents: 'none',
    transition: { duration: 0.01 },
    transitionEnd: { pointerEvents: 'none' },
  },
  expanded: {
    x: '0%',
    opacity: 1,
    boxShadow: 'var(--glass-toolbar-shadow)',
    pointerEvents: 'auto',
    transition: { duration: 0.01 },
    transitionEnd: { pointerEvents: 'auto' },
  },
}

const GlassToolbar = React.forwardRef<HTMLDivElement, GlassToolbarProps>(function GlassToolbar(
  {
    sections = DEFAULT_SECTIONS,
    activeSectionId,
    onSectionChange,
    onItemSelect,
    initialExpanded = false,
    className,
    style,
  },
  ref,
) {
  const pathname = usePathname()
  const [manualPinned, setManualPinned] = React.useState(initialExpanded)
  const [internalActive, setInternalActive] = React.useState(() => activeSectionId ?? sections[0]?.id ?? '')
  const [pointerInside, setPointerInside] = React.useState(false)
  const [focusInside, setFocusInside] = React.useState(false)
  const [hoverLock, setHoverLock] = React.useState(false)
  const [transientHover, setTransientHover] = React.useState(false)
  // Use a pointer gate so keyboard focus can expand the panel without pointer clicks keeping it open.
  const pointerFocusGate = React.useRef(false)
  const transientHoverTimeout = React.useRef<number | null>(null)
  const panelId = React.useId()
  const prefersReducedMotion = useReducedMotion()

  const activeSection = React.useMemo(
    () => sections.find((section) => section.id === internalActive) ?? sections[0],
    [internalActive, sections],
  )

  const pathSegments = React.useMemo(() => pathname?.split('/').filter(Boolean) ?? [], [pathname])
  const allowPersistentHover = pathSegments.length > 0

  const updateHoverLock = React.useCallback(
    (next: boolean) => {
      setHoverLock(next && allowPersistentHover)
    },
    [allowPersistentHover],
  )

  React.useEffect(() => {
    if (!allowPersistentHover) {
      setHoverLock(false)
    }
  }, [allowPersistentHover])

  React.useEffect(() => {
    const root = document.documentElement
    return () => {
      root.style.removeProperty('--glass-toolbar-offset')
    }
  }, [])

  React.useEffect(() => {
    if (activeSectionId) {
      setInternalActive(activeSectionId)
    }
  }, [activeSectionId])

  const autoExpand = React.useMemo(
    () => pointerInside || focusInside || hoverLock || transientHover,
    [pointerInside, focusInside, hoverLock, transientHover],
  )
  const primeTransientHover = React.useCallback(() => {
    if (allowPersistentHover) {
      return
    }
    if (transientHoverTimeout.current) {
      window.clearTimeout(transientHoverTimeout.current)
    }
    setTransientHover(true)
    transientHoverTimeout.current = window.setTimeout(() => {
      setTransientHover(false)
      transientHoverTimeout.current = null
    }, 900)
  }, [allowPersistentHover])

  React.useEffect(() => {
    if (allowPersistentHover) {
      setTransientHover(false)
      if (transientHoverTimeout.current) {
        window.clearTimeout(transientHoverTimeout.current)
        transientHoverTimeout.current = null
      }
    }
    return () => {
      if (transientHoverTimeout.current) {
        window.clearTimeout(transientHoverTimeout.current)
        transientHoverTimeout.current = null
      }
    }
  }, [allowPersistentHover])

  const expanded = manualPinned || autoExpand

  React.useEffect(() => {
    const root = document.documentElement
    const styles = getComputedStyle(root)
    const railWidth = styles.getPropertyValue('--glass-toolbar-rail-width').trim() || '78px'
    const panelWidth = styles.getPropertyValue('--glass-toolbar-panel-width').trim() || '320px'
    const expandedWidth = `calc(${railWidth} + ${panelWidth})`
    root.style.setProperty('--glass-toolbar-offset', expanded ? expandedWidth : railWidth)
  }, [expanded])

  const panelVariants = prefersReducedMotion ? PANEL_VARIANTS_REDUCED : PANEL_VARIANTS_EXPRESSIVE
  const menuVariants = React.useMemo<Variants>(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 1 },
        enter: { opacity: 1 },
        exit: { opacity: 1 },
      }
    }

    return {
      hidden: { opacity: 0 },
      enter: {
        opacity: 1,
        transition: {
          duration: 0.24,
          ease: [0.2, 0.0, 0.0, 1.0],
          delay: 0.05,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.2,
          ease: [0.4, 0.0, 1.0, 1.0],
          delay: 0.02,
        },
      },
    }
  }, [prefersReducedMotion])

  const handleSectionClick = React.useCallback(
    (sectionId: string, hasChildren: boolean) => {
      setInternalActive(sectionId)
      if (hasChildren) {
        updateHoverLock(true)
        setPointerInside(true)
        primeTransientHover()
        const section = sections.find((candidate) => candidate.id === sectionId)
        const firstItem = section?.items?.[0]
        if (firstItem) {
          onItemSelect?.(sectionId, firstItem.id)
        }
      } else if (!manualPinned) {
        updateHoverLock(false)
        setPointerInside(false)
        setFocusInside(false)
      } else {
        updateHoverLock(false)
      }
      onSectionChange?.(sectionId)
    },
    [manualPinned, onSectionChange, onItemSelect, primeTransientHover, sections, updateHoverLock],
  )

  const handleSectionPointerEnter = React.useCallback(
    (sectionId: string, hasChildren: boolean) => {
      setPointerInside(true)
      if (hasChildren) {
        updateHoverLock(true)
        primeTransientHover()
      } else {
        updateHoverLock(false)
        if (!allowPersistentHover && !manualPinned) {
          setPointerInside(false)
          setFocusInside(false)
          setTransientHover(false)
        }
      }
      setInternalActive(sectionId)
      onSectionChange?.(sectionId)
    },
    [allowPersistentHover, manualPinned, onSectionChange, primeTransientHover, updateHoverLock],
  )

  const handleItemClick = React.useCallback(
    (itemId: string) => {
      if (!activeSection) return
      updateHoverLock(true)
      onItemSelect?.(activeSection.id, itemId)
    },
    [activeSection, onItemSelect, updateHoverLock],
  )

  return (
    <aside
      ref={ref}
      className={cx('glass-toolbar', className)}
      data-expanded={expanded ? 'true' : 'false'}
      style={style}
      onPointerLeave={() => {
        setPointerInside(false)
        pointerFocusGate.current = false
        if (!manualPinned) {
          setFocusInside(false)
          if (!allowPersistentHover) {
            setHoverLock(false)
          }
        }
        setTransientHover(false)
        if (transientHoverTimeout.current) {
          window.clearTimeout(transientHoverTimeout.current)
          transientHoverTimeout.current = null
        }
      }}
      onPointerDownCapture={(event) => {
        pointerFocusGate.current = true
        if (manualPinned) {
          return
        }
        const target = event.target as HTMLElement | null
        const isActivator = Boolean(target?.closest('.glass-toolbar__pill'))
        const isPanel = Boolean(target?.closest('.glass-toolbar__panel'))
        const isUtility = Boolean(target?.closest('.glass-toolbar__rail-footer'))
        if (isActivator || isPanel || isUtility) {
          setPointerInside(true)
        } else {
          setPointerInside(false)
        }
      }}
      onPointerUpCapture={() => {
        pointerFocusGate.current = false
      }}
      onPointerCancelCapture={() => {
        pointerFocusGate.current = false
      }}
      onFocusCapture={() => {
        if (!pointerFocusGate.current) {
          setFocusInside(true)
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusInside(false)
        }
      }}
    >
      <div
        className="glass-toolbar__rail"
      >
        <div className="glass-toolbar__rail-top">
          <span className="glass-toolbar__mark" aria-hidden="true">
            RR
          </span>
          <span className="glass-toolbar__rail-label">Navigation</span>
        </div>

        <nav
          className="glass-toolbar__primary"
          aria-label="Primary navigation"
        >
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection?.id === section.id
            const hasChildren = Boolean(section.items?.length)
            return (
              <button
                key={section.id}
                type="button"
                className={cx('glass-toolbar__pill', isActive && 'is-active')}
                onClick={() => handleSectionClick(section.id, hasChildren)}
                onPointerEnter={() => handleSectionPointerEnter(section.id, hasChildren)}
                aria-pressed={isActive}
                aria-label={section.label}
                title={section.label}
                data-has-children={hasChildren ? 'true' : 'false'}
              >
                <div className="glass-toolbar__pill-icon-wrapper">
                  <Icon aria-hidden="true" />
                </div>
                <span className="glass-toolbar__pill-label">{section.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="glass-toolbar__rail-footer">
          <ThemeToggle variant="toolbar" className="glass-toolbar__theme-toggle" />
          <button
            type="button"
            className="glass-toolbar__toggle"
            onClick={() => setManualPinned((prev) => !prev)}
            aria-controls={panelId}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse toolbar' : 'Expand toolbar'}
          >
            <ChevronDoubleRightIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      <motion.div
        className="glass-toolbar__panel"
        id={panelId}
        aria-hidden={!expanded}
        initial={expanded ? 'expanded' : 'collapsed'}
        animate={expanded ? 'expanded' : 'collapsed'}
        variants={panelVariants}
        onPointerEnter={() => {
          setPointerInside(true)
          primeTransientHover()
        }}
      >
        <div className="glass-toolbar__panel-body">
          <AnimatePresence initial={false} mode="wait">
            {activeSection?.items && activeSection.items.length > 0 ? (
              <motion.ul
                key={activeSection.id}
                className="glass-toolbar__subnav"
                aria-label={`${activeSection.label} shortcuts`}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={menuVariants}
              >
                {activeSection.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onPointerEnter={() => {
                        setPointerInside(true)
                        updateHoverLock(true)
                        primeTransientHover()
                      }}
                      onFocus={() => {
                        setPointerInside(true)
                        updateHoverLock(true)
                        primeTransientHover()
                      }}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <span>{item.label}</span>
                      {item.description ? <small>{item.description}</small> : null}
                    </button>
                  </li>
                ))}
              </motion.ul>
            ) : (
              <motion.p
                key={`${activeSection?.id ?? 'none'}-empty`}
                className="glass-toolbar__empty"
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={menuVariants}
              >
                No shortcuts configured yet.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <footer className="glass-toolbar__footer">
          <button type="button" className="glass-toolbar__footer-cta">
            <ArrowLeftOnRectangleIcon aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </footer>
      </motion.div>
    </aside>
  )
})

GlassToolbar.displayName = 'GlassToolbar'

export type { ToolbarSection }
export default GlassToolbar
