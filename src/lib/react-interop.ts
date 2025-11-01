import * as React from 'react'

export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') ref(node)
      else (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

export function composeHandlers<E extends React.SyntheticEvent>(
  theirs?: (e: E) => void,
  ours?: (e: E) => void
) {
  return (e: E) => {
    theirs?.(e)
    if (!e.defaultPrevented) ours?.(e)
  }
}

export function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ')
}