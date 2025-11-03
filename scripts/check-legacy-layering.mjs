import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const DIR = 'src/styles/components'
const files = readdirSync(DIR).filter(f => f.endsWith('.css'))
const offenders = []

for (const f of files) {
  const text = readFileSync(join(DIR, f), 'utf8')
  if (!/@layer\s+/.test(text)) offenders.push(f)
}

if (offenders.length) {
  console.error('The following legacy component CSS files are missing @layer:\n' + offenders.map(x => ' - ' + x).join('\n'))
  process.exit(1)
} else {
  console.log('OK: All legacy component CSS files contain @layer.')
}