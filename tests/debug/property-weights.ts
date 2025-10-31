export const IGNORE: string[] = [
  '-webkit-font-smoothing','text-rendering','-webkit-text-size-adjust',
  'cursor','caret-color','outline-offset','user-select','-webkit-tap-highlight-color'
];

export const PROPS: Record<'critical'|'important'|'minor', string[]> = {
  critical: [
    'color','background-color','background-image',
    'font-family','font-size','font-weight',
    'display','position','z-index',
    'padding-top','padding-right','padding-bottom','padding-left',
    'margin-top','margin-right','margin-bottom','margin-left',
    'border-radius'
  ],
  important: [
    'line-height','letter-spacing','text-transform',
    'border-width','border-color','border-style',
    'box-shadow','opacity','transform',
    'gap','justify-content','align-items'
  ],
  minor: [
    'overflow','visibility','pointer-events',
    'filter','outline-width','outline-color'
  ]
};

export function weightOf(prop: string): number {
  if (PROPS.critical.includes(prop)) return 10;
  if (PROPS.important.includes(prop)) return 5;
  if (PROPS.minor.includes(prop)) return 1;
  return 0;
}
