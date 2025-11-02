#!/usr/bin/env zsh
set -euo pipefail

echo "▶ Phase 6: Token Cleanup & Migration (Alpha + Blur)"
echo "   - Adds OKLCH mix tokens, blur/saturate tokens"
echo "   - Fallbacks for sRGB + WebKit backdrop-filter"
echo "   - Stylelint extend config to ban rgba(alpha)"
echo "   - Playwright token sanity tests"
echo "   - Codemods for rgba → tokens & blur/saturate → tokens"
echo

# -------- Preflight ---------------------------------------------------------
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ Not inside a git repo. Init one first."; exit 1
fi

# Tools: ripgrep (rg), sd (stream editor), node
missing=()
command -v rg >/dev/null 2>&1 || missing+=("rg (ripgrep)")
command -v sd >/dev/null 2>&1 || missing+=("sd (stream editor)")
command -v node >/dev/null 2>&1 || missing+=("node")

if (( ${#missing[@]} )); then
  echo "⚠️ Missing tools: ${missing[*]}"
  echo "   Install with Homebrew:"
  echo "     brew install ripgrep sd node"
  echo
fi

# Paths
TOKENS_DIR="src/styles/tokens"
THEME_FILE="$TOKENS_DIR/theme.css"
ALPHA_FILE="$TOKENS_DIR/alpha-blur-mix.css"
STYLELINT_EXT="stylelint.extend.cjs"
TESTS_DIR="tests/theme"
TOK_TEST="$TESTS_DIR/tokenization.spec.ts"
PKG="package.json"

mkdir -p "$TOKENS_DIR" "$TESTS_DIR"

# -------- 1) Write tokens file (idempotent) --------------------------------
if [[ -f "$ALPHA_FILE" ]]; then
  echo "⏭  $ALPHA_FILE already exists (leaving as-is)"
else
  cat > "$ALPHA_FILE" <<'CSS'
/* ===========================
   PHASE 6: ALPHA / BLUR / MIX TOKENS
   =========================== */

/* 1) Alpha scale (fractions). Semantically named. */
:root {
  --alpha-hairline: 0.06;   /* hairline borders */
  --alpha-subtle:  0.08;    /* default borders, light dividers */
  --alpha-soft:    0.12;    /* standard dividers, mats */
  --alpha-med:     0.16;    /* hover outlines, image mats */
  --alpha-strong:  0.24;    /* overlays, inset shadows */
  --alpha-deep:    0.36;    /* modal scrims, strong glass */
  --alpha-heavy:   0.50;    /* max scrim */
}

/* 2) Blur / saturation scales for glass & backdrops */
:root {
  --blur-xs: 2px;
  --blur-sm: 4px;
  --blur-md: 8px;           /* replaces "8px" */
  --blur-lg: 12px;
  --blur-xl: 16px;

  --saturate-low: 1.1;
  --saturate-med: 1.2;      /* replaces "1.2" */
  --saturate-high: 1.35;
}

/* 3) Theme-aware mix base: Light→black, Dark→white */
:root { --mix-base: black; }
html[data-theme="dark"] { --mix-base: white; }

/* 4) Reusable mix results (OKLCH) */
:root {
  --mix-hairline: color-mix(in oklch, var(--mix-base) calc(var(--alpha-hairline) * 100%), transparent);
  --mix-subtle:   color-mix(in oklch, var(--mix-base) calc(var(--alpha-subtle)  * 100%), transparent);
  --mix-soft:     color-mix(in oklch, var(--mix-base) calc(var(--alpha-soft)    * 100%), transparent);
  --mix-med:      color-mix(in oklch, var(--mix-base) calc(var(--alpha-med)     * 100%), transparent);
  --mix-strong:   color-mix(in oklch, var(--mix-base) calc(var(--alpha-strong)  * 100%), transparent);
  --mix-deep:     color-mix(in oklch, var(--mix-base) calc(var(--alpha-deep)    * 100%), transparent);
  --mix-heavy:    color-mix(in oklch, var(--mix-base) calc(var(--alpha-heavy)   * 100%), transparent);

  /* Glass backdrops */
  --glass-backdrop: blur(var(--blur-md)) saturate(var(--saturate-med));
  --glass-backdrop-strong: blur(var(--blur-lg)) saturate(var(--saturate-high));
}

/* 5) Progressive enhancement fallbacks for engines w/o OKLCH */
@supports not (color: oklch(50% 0.05 30)) {
  :root {
    --mix-hairline: rgba(0,0,0,0.06);
    --mix-subtle:   rgba(0,0,0,0.08);
    --mix-soft:     rgba(0,0,0,0.12);
    --mix-med:      rgba(0,0,0,0.16);
    --mix-strong:   rgba(0,0,0,0.24);
    --mix-deep:     rgba(0,0,0,0.36);
    --mix-heavy:    rgba(0,0,0,0.50);
  }
  html[data-theme="dark"] {
    --mix-hairline: rgba(255,255,255,0.06);
    --mix-subtle:   rgba(255,255,255,0.08);
    --mix-soft:     rgba(255,255,255,0.12);
    --mix-med:      rgba(255,255,255,0.16);
    --mix-strong:   rgba(255,255,255,0.24);
    --mix-deep:     rgba(255,255,255,0.36);
    --mix-heavy:    rgba(255,255,255,0.50);
  }
}

/* 6) Backdrop-filter vendor guard (Safari/WebKit) */
.glass-backdrop {
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
}

/* TL;DR:
   Borders/Dividers:  border-color: var(--mix-subtle);
   Mats/Overlays:     background: var(--mix-soft|--mix-med|--mix-strong|--mix-deep);
   Glass:             backdrop-filter: var(--glass-backdrop); -webkit-backdrop-filter: var(--glass-backdrop);
*/
CSS
  echo "✅ Wrote $ALPHA_FILE"
fi

# -------- 2) Import tokens into theme.css (idempotent) ----------------------
if [[ -f "$THEME_FILE" ]]; then
  if rg -q 'alpha-blur-mix\.css' "$THEME_FILE"; then
    echo "⏭  theme.css already imports alpha-blur-mix.css"
  else
    # Append a local @import; PostCSS will inline via postcss-import (if present)
    printf "\n/* Phase 6 tokens */\n@import \"./alpha-blur-mix.css\";\n" >> "$THEME_FILE"
    echo "✅ Appended @import to $THEME_FILE"
  fi
else
  # Create a minimal theme.css with the import to avoid breaking builds
  cat > "$THEME_FILE" <<'CSS'
/* tokens/theme.css (created by Phase 6) */
@import "./alpha-blur-mix.css";
/* Add your existing theme tokens above/below as needed */
CSS
  echo "✅ Created $THEME_FILE with Phase 6 import"
fi

# -------- 3) Stylelint extend config (non-disruptive) -----------------------
if [[ -f "$STYLELINT_EXT" ]]; then
  echo "⏭  $STYLELINT_EXT already exists"
else
  cat > "$STYLELINT_EXT" <<'CJS'
/**
 * Non-disruptive Stylelint extender that bans rgba() with alpha.
 * Use via: npx stylelint "src/**/*.css" --config stylelint.extend.cjs
 */
module.exports = {
  rules: {
    "declaration-property-value-disallowed-list": {
      "/.*/": [/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0?\.?\d+\s*\)/i],
    },
  },
};
CJS
  echo "✅ Wrote $STYLELINT_EXT"
fi

# Wire a helper script in package.json (idempotent, requires node)
if [[ -f "$PKG" ]]; then
  node - <<'NODE'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.scripts ||= {};
if (!pkg.scripts['lint:rgba']) {
  pkg.scripts['lint:rgba'] = 'stylelint "src/**/*.css" --config stylelint.extend.cjs';
}
if (!pkg.devDependencies) pkg.devDependencies = {};
pkg.devDependencies['stylelint'] ||= '^16.25.0';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Updated package.json (scripts.lint:rgba, devDeps.stylelint)');
NODE
else
  echo "⚠️ No package.json found; skipping Stylelint script wiring"
fi

# -------- 4) Playwright sanity tests ----------------------------------------
if [[ -f "$TOK_TEST" ]]; then
  echo "⏭  $TOK_TEST already exists"
else
  cat > "$TOK_TEST" <<'TS'
import { test, expect } from '@playwright/test';

test('mix tokens resolve and theme flips base', async ({ page }) => {
  await page.goto('/primitives-test').catch(() => page.goto('/'));
  const getVar = (name: string) =>
    page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);

  const mixBaseLight = await getVar('--mix-base');
  expect(mixBaseLight).toBe('black');

  const mixSubtle = await getVar('--mix-subtle');
  expect(mixSubtle && mixSubtle.length > 0).toBeTruthy();

  await page.evaluate(() => document.documentElement.setAttribute('data-theme','dark'));
  const mixBaseDark = await getVar('--mix-base');
  expect(mixBaseDark).toBe('white');
});

test('navbar uses glass-backdrop tokens if navbar is present', async ({ page }) => {
  await page.goto('/').catch(() => {});
  const navbar = page.locator('.navbar');
  if (await navbar.count() === 0) test.skip(true, 'No .navbar on this route');
  const ok = await navbar.evaluate((el) => {
    const cs = getComputedStyle(el as HTMLElement);
    return cs.getPropertyValue('backdrop-filter').includes('var(--glass-backdrop)') ||
           cs.getPropertyValue('-webkit-backdrop-filter').includes('var(--glass-backdrop)');
  });
  expect(ok).toBeTruthy();
});
TS
  echo "✅ Wrote $TOK_TEST"
fi

# -------- 5) Codemods: rgba → tokens; blur/saturate → tokens ----------------

function replace_all() {
  local PAT="$1" REPL="$2"
  local files; IFS=$'\n' files=($(rg -l --hidden --glob '!**/node_modules/**' --glob '!**/dist/**' "$PAT" src || true))
  if (( ${#files[@]} )); then
    echo "↻ Replacing ${#files[@]} occurrence files for /$PAT/ → $REPL"
    sd -s "$PAT" "$REPL" "${files[@]}"
  else
    echo "⏭  No matches for /$PAT/"
  fi
}

echo "🧼 Replacing literal rgba(alpha) with semantic tokens…"

# WHITE mixes (light-on-dark)
replace_all 'rgba(255, 255, 255, 0.06)' 'var(--mix-hairline)'
replace_all 'rgba(255, 255, 255, 0.08)' 'var(--mix-subtle)'
replace_all 'rgba(255, 255, 255, 0.12)' 'var(--mix-soft)'
replace_all 'rgba(255, 255, 255, 0.15)' 'var(--mix-med)'
replace_all 'rgba(255, 255, 255, 0.16)' 'var(--mix-med)'
replace_all 'rgba(255, 255, 255, 0.24)' 'var(--mix-strong)'
replace_all 'rgba(255, 255, 255, 0.36)' 'var(--mix-deep)'
replace_all 'rgba(255, 255, 255, 0.5)'  'var(--mix-heavy)'

# BLACK mixes (dark-on-light)
replace_all 'rgba(0, 0, 0, 0.06)' 'var(--mix-hairline)'
replace_all 'rgba(0, 0, 0, 0.08)' 'var(--mix-subtle)'
replace_all 'rgba(0, 0, 0, 0.12)' 'var(--mix-soft)'
replace_all 'rgba(0, 0, 0, 0.15)' 'var(--mix-med)'
replace_all 'rgba(0, 0, 0, 0.16)' 'var(--mix-med)'
replace_all 'rgba(0, 0, 0, 0.24)' 'var(--mix-strong)'
replace_all 'rgba(0, 0, 0, 0.36)' 'var(--mix-deep)'
replace_all 'rgba(0, 0, 0, 0.5)'  'var(--mix-heavy)'

echo "🧼 Replacing blur(8px) saturate(1.2) with tokens…"
# Note: This is a simple string replacement, not regex-based like the function expects
# We'll handle this manually if found
if rg -q 'blur\(8px\) saturate\(1\.2\)' src; then
  echo "↻ Replacing backdrop-filter blur/saturate literals"
  # Use a more permissive pattern for sd
  sd 'blur(8px) saturate(1.2)' 'var(--glass-backdrop)' $(rg -l 'blur\(8px\) saturate\(1\.2\)' src || true)
fi

# -------- 6) Commit in small chunks ----------------------------------------
git add -A
if ! git diff --cached --quiet; then
  git commit -m "feat(tokens): Phase 6 - add OKLCH mix + glass tokens, sRGB/WS fallback, Stylelint extender, Playwright token tests, codemods

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
  echo "✅ Committed Phase 6 changes"
else
  echo "⏭  No changes staged (everything already applied)"
fi

# -------- 7) Post-run hints -------------------------------------------------
echo
echo "Done ✅"
echo "Next:"
echo "  • Run:  npm run lint:rgba"
echo "  • Run:  npx playwright test $TOK_TEST   (ensure @playwright/test is installed)"
echo "  • Visual spot-check navbar/mobile-menu/modals glass & borders in light/dark"
echo
echo "Acceptance criteria:"
echo "  ✓ No literal rgba(alpha) remains in src/styles/**"
echo "  ✓ blur(8px) saturate(1.2) replaced with var(--glass-backdrop) (+ -webkit-)"
echo "  ✓ Theme flip changes --mix-base (black↔white)"
echo "  ✓ Token tests pass"
