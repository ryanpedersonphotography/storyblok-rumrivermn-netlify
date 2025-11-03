import { readFileSync } from 'fs';
import { createHash } from 'crypto';

const FILE = 'src/components/clean/Hero.tsx';
// Replace this after you set it the first time:
const EXPECTED = process.env.HERO_ADAPTER_SHA256;

if (!EXPECTED) {
  console.error('Missing HERO_ADAPTER_SHA256 env var. Run the setup command printed in the README step.');
  process.exit(1);
}

const buf = readFileSync(FILE);
const hash = createHash('sha256').update(buf).digest('hex');

if (hash !== EXPECTED) {
  console.error('Hero adapter hash mismatch. File was modified:\n' + FILE);
  console.error(`Expected: ${EXPECTED}\nActual  : ${hash}`);
  process.exit(1);
}
console.log('OK: Hero adapter hash verified.');
