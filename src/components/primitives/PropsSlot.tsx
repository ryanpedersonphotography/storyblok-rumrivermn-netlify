import * as React from 'react'
import { composeRefs, cx } from '@/lib/react-interop'

type PropsSlotProps = {
  /** Props to inject into the ONLY child (className is merged, handlers composed). */
  inject?: React.HTMLAttributes<HTMLElement> & { className?: string }
  children: React.ReactElement
}

export const PropsSlot = React.forwardRef<HTMLElement, PropsSlotProps>(
  ({ inject, children }, forwardedRef) => {
    const child = React.Children.only(children) as React.ReactElement & {
      ref?: React.Ref<HTMLElement>
      props: any
      type: any
    }

    const mergedClass = cx(child.props.className, inject?.className)
    const mergedStyle = { ...(child.props.style || {}), ...(inject?.style || {}) }

    const injected: any = { ...inject, className: mergedClass, style: mergedStyle }

    // Compose the ref so both the child's ref and our forwardedRef receive the node.
    injected.ref = composeRefs(child.ref as React.Ref<HTMLElement>, forwardedRef)

    // Compose a few common handlers (opt-in if present).
    for (const key of Object.keys(inject || {})) {
      if (!/^on[A-Z]/.test(key)) continue
      const theirs = (child.props as any)[key]
      const ours = (inject as any)[key]
      injected[key] = theirs ? ((e: any) => { theirs(e); if (!e.defaultPrevented) ours(e) }) : ours
    }

    // Data attributes & aria-* merge without conflict by spreading last.
    return React.cloneElement(child, injected)
  }
)
PropsSlot.displayName = 'PropsSlot'