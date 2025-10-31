import { chromium } from '@playwright/test';
import { extractCriticalTree, severityScore } from '../tests/debug/extract-critical-tree.js';
import { PROPS } from '../tests/debug/property-weights.js';

const CRITICAL_SELECTORS = [
  '.hero-content','.hero-title','.hero-title-accent','.hero-lead','.hero-cta','.hero-eyebrow'
];
const WANT_PROPS = [...PROPS.critical, ...PROPS.important, ...PROPS.minor];

const SECTION = process.argv[2] || 'hero';
const DEBUG = process.argv.includes('--debug');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // HOTFIX
  await page.goto('https://localhost:9999');
  const hot = await extractCriticalTree(page, `[data-section="${SECTION}"]`, CRITICAL_SELECTORS, WANT_PROPS);

  // CLEAN
  await page.goto('https://localhost:9999/clean');
  const cln = await extractCriticalTree(page, `[data-section="${SECTION}"]`, CRITICAL_SELECTORS, WANT_PROPS);

  // Compare node-by-node by selector key
  const bySelHot = Object.fromEntries(hot.map(n => [n.selector, n]));
  const bySelCln = Object.fromEntries(cln.map(n => [n.selector, n]));

  let totalScore = 0;
  for (const sel of CRITICAL_SELECTORS) {
    const h = bySelHot[sel], c = bySelCln[sel];
    if (!h || !c) {
      console.log(`❌ Missing node for selector: ${sel} (hotfix or clean)`);
      totalScore += 50; // heavy penalty
      continue;
    }
    const score = severityScore(h.styles, c.styles);
    totalScore += score;
    const rectDelta =
      Math.abs(h.rect.width - c.rect.width) +
      Math.abs(h.rect.height - c.rect.height) +
      Math.abs(h.rect.x - c.rect.x) +
      Math.abs(h.rect.y - c.rect.y);

    if (score > 0 || rectDelta > 4) {
      console.log(`⚠️  ${sel}: styleScore=${score} rectΔ≈${rectDelta.toFixed(2)}`);
      if (DEBUG) {
        console.dir({ hot: h.styles, clean: c.styles }, { depth: 0 });
      }
    } else {
      console.log(`✅ ${sel}: match`);
    }
  }

  console.log(`\nSummary severity score: ${totalScore}`);
  await browser.close();

  // Non-zero score doesn't hard-fail by default; make it fail when used in CI if desired:
  if (process.argv.includes('--strict') && totalScore > 10) process.exit(1);
})();
