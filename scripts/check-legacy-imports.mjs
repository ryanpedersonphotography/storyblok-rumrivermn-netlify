import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const ROOT = 'src/app'
const LEGACY_MARKER = 'styles/components/'
const ALLOWLIST = new Set([
  'src/app/(site)/layout.tsx',
])

function walk(dir, acc = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

const files = walk(ROOT).filter(f => /\.(tsx|ts|js|jsx|css)$/.test(f))
const offenders = []

for (const f of files) {
  const text = readFileSync(f, 'utf8')
  // Check for actual imports, not just mentions in comments
  const importRegex = /^import\s+.*styles\/components\//m
  if (importRegex.test(text)) {
    if (!ALLOWLIST.has(f)) offenders.push(f)
  }
}

if (offenders.length) {
  console.error('Legacy CSS imported outside allowlist:\n' + offenders.map(x => ' - ' + x).join('\n'))
  process.exit(1)
} else {
  console.log('OK: No legacy imports outside allowlist.')
}