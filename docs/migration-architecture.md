

Migration Roadmap (with checkpoints)

Goals
	1.	Strict isolation: (migration) renders only tokens + primitives + base globals.
	2.	Legacy stability: (site) keeps working with legacy CSS while you migrate piece by piece.
	3.	Predictable cascade: everything (including legacy) sits under explicit @layer.
	4.	Hard guardrails: CI/CLI checks catch any re-introduction of legacy CSS into the wrong places.

High-level phases
	1.	Pre-flight & safety branch
	2.	Create route groups and move pages
	3.	Minimal root layout (no CSS imports)
	4.	Legacy site layout (loads all legacy CSS, plus primitives)
	5.	Migration clean-room layout (tokens + primitives + base only)
	6.	Layer unlayered legacy CSS (the 5 offenders + enforceable check)
	7.	Guardrails (scripts + CI hooks)
	8.	Component-by-component migration loop
	9.	Cleanup & flatten (optional)

⸻

One-Shot Automation Script (zsh)

Paste this entire block into your terminal (macOS zsh) or pipe into your agent. It is idempotent and pauses at checkpoints so you can test locally between phases.

#!/usr/bin/env zsh
set -euo pipefail

# -----------------------------
# Helpers
# -----------------------------
say() { printf "\n\033[1m%s\033[0m\n" "$*"; }
ok()  { printf "✅ %s\n" "$*"; }
warn(){ printf "⚠️  %s\n" "$*"; }
die() { printf "🛑 %s\n" "$*"; exit 1; }

need() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required tool: $1"
}

# Optional installs (comment out if you manage tooling yourself)
if ! command -v rg >/dev/null 2>&1; then
  warn "ripgrep (rg) not found. Installing via Homebrew..."
  if command -v brew >/dev/null 2>&1; then
    brew install ripgrep
  else
    die "Homebrew not found. Install ripgrep manually or install Homebrew."
  fi
fi

# Confirm repository root
[ -d ".git" ] || die "Run this from the root of your repo."

# -----------------------------
# Phase 0 — Preflight
# -----------------------------
say "Phase 0 — Preflight"
git rev-parse --abbrev-ref HEAD >/dev/null || die "Not in a git repo?"
ok "Git repo OK"

BRANCH="chore/migrate-clean-room"
if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  warn "Branch $BRANCH already exists. Reusing."
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
  ok "Created branch $BRANCH"
fi

# -----------------------------
# Phase 1 — Route groups + moves
# -----------------------------
say "Phase 1 — Create route groups and move pages"

mkdir -p src/app/(site) src/app/(migration)

# Move homepage to (site)
if [ -f src/app/page.tsx ]; then
  git mv src/app/page.tsx src/app/(site)/page.tsx
  ok "Moved: src/app/page.tsx -> src/app/(site)/page.tsx"
else
  warn "src/app/page.tsx not found (already moved?)."
fi

# Move migration/demo pages to (migration)
for p in primitives-migration primitives-demo primitives-test button-primitive-demo hero-button-migration dialog-demo; do
  if [ -d "src/app/$p" ]; then
    mkdir -p "src/app/(migration)/$p"
    if [ -f "src/app/$p/page.tsx" ]; then
      git mv "src/app/$p/page.tsx" "src/app/(migration)/$p/page.tsx"
      ok "Moved: src/app/$p/page.tsx -> src/app/(migration)/$p/page.tsx"
    fi
    # remove empty dir if any
    rmdir "src/app/$p" 2>/dev/null || true
  else
    warn "src/app/$p not found (skip)"
  fi
done

# Remove unused app-level globals if present (the stray one)
if [ -f src/app/globals.css ]; then
  git rm -f src/app/globals.css
  ok "Removed stray src/app/globals.css"
fi

git add -A
git commit -m "feat: add (site) and (migration) route groups; move pages"
ok "Checkpoint A — Route groups ready"

printf "\n\033[36m--- PAUSE ---\033[0m\nVisit:\n  • / (should now route from (site)/page.tsx)\n  • /primitives-migration (should now be under (migration))\nPress Enter to continue..."
read -r

# -----------------------------
# Phase 2 — Minimal root layout (CSS-free)
# -----------------------------
say "Phase 2 — Minimal root layout (no CSS imports)"

# Write root layout as TSX (you can keep .js if you prefer)
cat > src/app/layout.tsx <<'TSX'
// src/app/layout.tsx
// MINIMAL ROOT: no CSS imports; providers only.

import StoryblokProvider from '@/components/StoryblokProvider'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { playfairDisplay, montserrat, dancingScript } from './fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoryblokProvider>
      <html
        lang="en"
        className={`${playfairDisplay.variable} ${montserrat.variable} ${dancingScript.variable}`}
        suppressHydrationWarning
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{
                var choice=localStorage.getItem('theme')||'system';
                var m=window.matchMedia('(prefers-color-scheme: dark)');
                var effective=choice==='system'?(m.matches?'dark':'light'):choice;
                var root=document.documentElement;
                root.setAttribute('data-theme',effective);
                root.style.setProperty('color-scheme',effective==='dark'?'dark':'light');
                root.setAttribute('data-theme-choice',choice);
                var b=localStorage.getItem('rr.brand')||'romantic';
                root.setAttribute('data-brand',(b==='modern'?'modern':'romantic'));
              }catch(e){}})();`,
            }}
          />
        </head>
        <body>
          <ThemeProvider>
            <div data-clean-root="true">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </StoryblokProvider>
  )
}
TSX

# If a JS root layout still exists, remove it to avoid dual roots
if [ -f src/app/layout.js ]; then
  git rm -f src/app/layout.js
  ok "Removed old src/app/layout.js"
fi

git add -A
git commit -m "feat: minimal CSS-free root layout (providers only)"
ok "Checkpoint B — Root layout is CSS-free"

printf "\n\033[36m--- PAUSE ---\033[0m\nRestart dev server if running. Verify root renders (no CSS imports at root).\nPress Enter to continue..."
read -r

# -----------------------------
# Phase 3 — Legacy site layout (loads everything)
# -----------------------------
say "Phase 3 — Legacy (site) layout that imports all CSS + Navbar"

mkdir -p src/app/(site)
cat > src/app/(site)/layout.tsx <<'TSX'
// src/app/(site)/layout.tsx
// Legacy site shell: tokens + primitives + globals + ALL legacy components

// 1) Tokens define @layer order
import '@/styles/tokens/theme.css'

// 2) Primitives for migrated pieces used on the site
import '@/styles/primitives/index.css'

// 3) Base globals (your true base reset/typography)
import '@/styles/globals.css'

// 4) Legacy component CSS (must be layered; see Phase 5)
import '@/styles/components/navbar.css'
import '@/styles/components/hero.css'
import '@/styles/components/experience.css'
import '@/styles/components/spaces.css'
import '@/styles/components/gallery.css'
import '@/styles/components/alternating-blocks.css'
import '@/styles/components/brand-proof.css'
import '@/styles/components/pricing.css'
import '@/styles/components/schedule-form.css'
import '@/styles/components/map.css'
import '@/styles/components/footer.css'
import '@/styles/components/faq.css'
import '@/styles/components/section.css'
import '@/styles/components/section.wrapper.css'
import '@/styles/components/section.legacy-wrapper.css'
import '@/styles/components/section.variants.css'
import '@/styles/components/buttons.css'

import Navbar from '@/components/clean/Navbar'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
TSX

git add -A
git commit -m "feat: (site) layout with full legacy CSS and Navbar"
ok "Checkpoint C — (site) stable with legacy + primitives"

printf "\n\033[36m--- PAUSE ---\033[0m\nOpen / to ensure legacy site still looks correct.\nPress Enter to continue..."
read -r

# -----------------------------
# Phase 4 — Migration clean-room layout
# -----------------------------
say "Phase 4 — Clean-room (migration) layout: tokens + primitives + base only"

mkdir -p src/app/(migration)
cat > src/app/(migration)/layout.tsx <<'TSX'
// src/app/(migration)/layout.tsx
// Clean room: tokens + primitives + base only. NO legacy imports.

import '@/styles/tokens/theme.css'
import '@/styles/primitives/index.css'
import '@/styles/globals.css'           // ensure this is base-only (no hidden legacy)

export default function MigrationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
TSX

git add -A
git commit -m "feat: (migration) layout clean-room (no legacy CSS)"
ok "Checkpoint D — (migration) isolated"

printf "\n\033[36m--- PAUSE ---\033[0m\nOpen /primitives-migration. Inspect elements -> Computed styles.\nConfirm no rules from src/styles/components/*.css.\nPress Enter to continue..."
read -r

# -----------------------------
# Phase 5 — Layer unlayered legacy CSS
# -----------------------------
say "Phase 5 — Layer the 5 unlayered legacy CSS files"

wrap_layer () {
  f="$1"
  if [ -f "$f" ]; then
    if rg -n "^@layer " "$f" >/dev/null 2>&1; then
      ok "Already layered: $f"
    else
      tmp="${f}.tmp"
      printf "@layer components {\n" > "$tmp"
      cat "$f" >> "$tmp"
      printf "\n}\n" >> "$tmp"
      mv "$tmp" "$f"
      ok "Layered: $f"
    fi
  else
    warn "Missing file (skip): $f"
  fi
}

for f in \
  src/styles/components/brand-proof.css \
  src/styles/components/experience.css \
  src/styles/components/map.css \
  src/styles/components/schedule-form.css \
  src/styles/components/spaces.css
do
  wrap_layer "$f"
done

git add -A
git commit -m "chore: wrap unlayered legacy CSS in @layer components"
ok "Checkpoint E — all legacy files layered"

printf "\n\033[36m--- PAUSE ---\033[0m\nReload /(site) pages. No visual regressions expected.\nPress Enter to continue..."
read -r

# -----------------------------
# Phase 6 — Enforceable guardrails
# -----------------------------
say "Phase 6 — Add checks to prevent regressions"

mkdir -p scripts

# 6a) Check: no imports of legacy CSS outside (site) layout
cat > scripts/check-legacy-imports.mjs <<'MJS'
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
  if (text.includes(LEGACY_MARKER)) {
    if (!ALLOWLIST.has(f)) offenders.push(f)
  }
}

if (offenders.length) {
  console.error('Legacy CSS imported outside allowlist:\n' + offenders.map(x => ' - ' + x).join('\n'))
  process.exit(1)
} else {
  console.log('OK: No legacy imports outside allowlist.')
}
MJS

# 6b) Check: all legacy component CSS files contain @layer
cat > scripts/check-legacy-layering.mjs <<'MJS'
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
MJS

# 6c) Package.json scripts (appending/upserting)
if [ -f package.json ]; then
  node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json","utf8"));
    pkg.scripts ||= {};
    pkg.scripts["guard:legacy-imports"] = "node scripts/check-legacy-imports.mjs";
    pkg.scripts["guard:legacy-layering"] = "node scripts/check-legacy-layering.mjs";
    pkg.scripts["guard:all"] = "npm run guard:legacy-imports && npm run guard:legacy-layering";
    fs.writeFileSync("package.json", JSON.stringify(pkg,null,2));
  '
  ok "Added guard scripts to package.json"
else
  warn "No package.json found (skipped adding scripts)."
fi

git add -A
git commit -m "chore: add guard scripts to enforce isolation and layering"
ok "Checkpoint F — guardrails installed"

printf "\n\033[36m--- PAUSE ---\033[0m\nRun: npm run guard:all\nExpect both checks to pass.\nPress Enter to continue..."
read -r

# -----------------------------
# Phase 7 — Verify @layer order in tokens
# -----------------------------
say "Phase 7 — Verify @layer order (tokens/theme.css)"

TOK="src/styles/tokens/theme.css"
if [ -f "$TOK" ]; then
  if rg -n "^@layer " "$TOK" >/dev/null 2>&1; then
    ok "@layer declaration found in $TOK"
  else
    warn "No @layer declaration found in $TOK. Adding a canonical order..."
    cat <<'CSS' >> "$TOK"

/* Canonical layer order */
@layer reset, tokens, primitives, recipes, components-legacy, components, utilities;
CSS
    ok "Appended canonical @layer order to $TOK"
  fi
else
  warn "$TOK not found. Ensure tokens file declares @layer order at top of cascade."
fi

git add -A
git commit -m "chore: ensure canonical @layer order is declared"
ok "Checkpoint G — cascade order confirmed"

printf "\n\033[36m--- PAUSE ---\033[0m\nRebuild dev. In /primitives-migration, confirm no legacy rules leak.\nPress Enter to continue..."
read -r

# -----------------------------
# Phase 8 — Component migration template
# -----------------------------
say "Phase 8 — Add component migration template (docs for yourself/agents)"

mkdir -p docs
cat > docs/migration-playbook.md <<'MD'
# Component Migration Playbook

## Goal
Replace each legacy component with a primitives-based implementation, then remove its legacy CSS import from `src/app/(site)/layout.tsx`.

## Steps (repeat per component)
1. **Build in clean room**  
   - Create/mount the new component inside `(migration)` pages first.  
   - Ensure it uses tokens/primitives only (no legacy selectors).
2. **Visual QA in clean room**  
   - Cross-check spacing/typography/shadows/density via tokens.
3. **Wire on (site)**  
   - Swap the legacy component with the new one on a single route/section.
4. **Delete legacy CSS import**  
   - Remove the corresponding `import '@/styles/components/<name>.css'` from `(site)/layout.tsx`.
5. **Run guardrail checks**  
   - `npm run guard:all`
6. **Regression sweep**  
   - Click through key breakpoints (≤380px, 768px, ≥900px density tiers).
7. **Commit**  
   - `git commit -m "migrate(<component>): primitives version; drop legacy CSS"`

## Example: Hero
- Implement `HeroPrimitive` under `src/components/primitive/HeroPrimitive.tsx`.
- Mount in `(migration)/primitives-demo` and verify.
- Replace legacy hero usage in `(site)/page.tsx`.
- Remove `import '@/styles/components/hero.css'` in `(site)/layout.tsx`.
- Run guardrails; commit.

MD

git add -A
git commit -m "docs: add component migration playbook"
ok "Checkpoint H — playbook ready"

printf "\n\033[36m--- PAUSE ---\033[0m\nOpen docs/migration-playbook.md for the per-component loop.\nPress Enter to continue..."
read -r

# -----------------------------
# Phase 9 — Final pointers
# -----------------------------
say "Phase 9 — Final pointers"

ok "You can now migrate components one by one and delete legacy imports safely."
ok "Run guardrails in CI to keep isolation intact: npm run guard:all"

echo
say "All phases complete."


⸻

Directory Layout (post-script)

src/
  app/
    layout.tsx                     # CSS-free root
    (site)/
      layout.tsx                   # imports tokens, primitives, globals, ALL legacy css, Navbar
      page.tsx                     # your primary homepage
    (migration)/
      layout.tsx                   # clean room (tokens + primitives + base only)
      primitives-migration/page.tsx
      primitives-demo/page.tsx
      primitives-test/page.tsx
      button-primitive-demo/page.tsx
      hero-button-migration/page.tsx
      dialog-demo/page.tsx
  components/
    clean/
      Navbar.tsx
    primitive/
      HeroPrimitive.tsx            # example target for migration loop
  styles/
    tokens/
      theme.css                    # declares @layer order (see script)
    primitives/
      index.css                    # your primitives system
    components/
      hero.css                     # now wrapped in @layer components { ... }
      experience.css               # same
      spaces.css                   # same
      brand-proof.css              # same
      schedule-form.css            # same
      map.css                      # same
      ...
    globals.css                    # true base reset/typography only (no component rules)
docs/
  migration-playbook.md
scripts/
  check-legacy-imports.mjs
  check-legacy-layering.mjs


⸻

Per-Component Migration (detailed loop)

Use this for each legacy section (Hero, Experience, Spaces, Gallery, etc.):
	1.	Build the new component in clean room
	•	Create src/components/primitive/<Component>.tsx.
	•	Use primitives + tokens only; no components/* selectors.
	•	If you need new recipes/utilities, add to styles/primitives/index.css or dedicated recipe files under a @layer recipes.
	2.	Wire it into a (migration) page
	•	Mount the component in src/app/(migration)/primitives-demo/page.tsx and verify spacing/density:
	•	<380px: compact
	•	default
	•	>900px: spacious
	3.	Switch it into (site)
	•	Replace the legacy component usage on a single route (e.g., homepage hero).
	•	Keep legacy CSS imports still present at this moment.
	4.	Remove the legacy CSS import
	•	In src/app/(site)/layout.tsx, delete the specific import '@/styles/components/<legacy>.css' line for the component you replaced.
	5.	Run checks
	•	npm run guard:all must pass.
	•	Manual QA on primary breakpoints.
	6.	Commit
	•	git commit -m "migrate(<component>): primitives version; drop legacy CSS"
	7.	Rinse and repeat for the next component.

⸻

Common Gotchas (and how we prevented them)
	•	Global CSS at root: eliminated; root has no CSS imports.
	•	Legacy specificity spikes: fixed by wrapping every legacy file under @layer components { ... } and setting canonical order in tokens/theme.css.
	•	Silent regressions: the guard scripts fail fast if legacy CSS is imported anywhere except src/app/(site)/layout.tsx.
	•	Hidden legacy in globals: keep styles/globals.css base-only. If you ever add component selectors there, the clean room will be polluted.

⸻

Reference Docs
	•	Next.js App Router – Route Groups: https://nextjs.org/docs/app/building-your-application/routing/route-groups￼
	•	Next.js App Router – Layouts & Nesting: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts￼
	•	CSS Cascade Layers (@layer) – MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer￼

⸻

