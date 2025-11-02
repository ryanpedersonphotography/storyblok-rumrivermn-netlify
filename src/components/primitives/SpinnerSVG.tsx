import * as React from 'react'

export function SpinnerSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity=".25"
      />
      <path
        d="M21 12a9 9 0 0 1-9 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  )
}
