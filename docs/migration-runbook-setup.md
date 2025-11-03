
One-time setup (run from the repo root)

# Ensure we’re at the repo root (where .git and package.json live)
[ -d .git ] || { echo "Run this from the repo root."; exit 1; }

# Create docs folder if missing
mkdir -p docs

# Create the migration runbook (Claude will use this file as the single source of truth)
cat > docs/migration-runbook.md <<'MD'
# Migration Runbook — (site)/(migration) Split & CSS Isolation

> Working directory: **repository root** (NOT /src).  
> Primary goals: strict style isolation, predictable cascade layering, safe incremental rollout.

---

## Invariants (never violate)
- Do **not** import `src/styles/components/*.css` anywhere except `src/app/(site)/layout.tsx`.
- Keep the **root layout** CSS-free (providers only).
- Maintain canonical layer order in `src/styles/tokens/theme.css`:  
  `@layer reset, tokens, primitives, recipes, components-legacy, components, utilities;`
- Keep `src/styles/globals.css` strictly **base/reset/typography**; no component selectors.

---

## Phase 0 — Safety branch
- [ ] Create a working branch: `git checkout -b chore/migrate-clean-room`

---

## Phase 1 — Route groups & moves
- [ ] Create groups: `src/app/(site)/` and `src/app/(migration)/`
- [ ] Move homepage → `src/app/(site)/page.tsx` (if it exists at `src/app/page.tsx`)
- [ ] Move migration/demo pages into `src/app/(migration)/...`
- [ ] Delete stray `src/app/globals.css` if it exists (unused and confusing)

**Verification**
- [ ] `/(site)` page loads as your home (usually `/`)
- [ ] `/primitives-migration` renders from `(migration)` group

---

## Phase 2 — Minimal root layout
- [ ] Replace `src/app/layout.tsx` with a CSS-free provider shell
- [ ] Remove any old `src/app/layout.js` to avoid dual roots

**Verification**
- [ ] Root layout imports **no CSS**
- [ ] App still renders (providers intact)

---

## Phase 3 — Legacy site layout (`(site)`)
- [ ] Create `src/app/(site)/layout.tsx`
- [ ] Import: tokens → primitives → globals → **all legacy component CSS**
- [ ] Render `<Navbar />` here (not in root)

**Verification**
- [ ] `/` looks like production again
- [ ] No errors about duplicate CSS imports

---

## Phase 4 — Migration clean room (`(migration)`)
- [ ] Create `src/app/(migration)/layout.tsx`
- [ ] Import: tokens → primitives → base globals
- [ ] **Do not** import legacy component CSS

**Verification**
- [ ] On `/primitives-migration`, DevTools → Computed shows **no** rules from `src/styles/components/*.css`

---

## Phase 5 — Layer the unlayered legacy CSS
Wrap the entire contents of these files in `@layer components { ... }`:

- `src/styles/components/brand-proof.css`
- `src/styles/components/experience.css`
- `src/styles/components/map.css`
- `src/styles/components/schedule-form.css`
- `src/styles/components/spaces.css`

**Verification**
- [ ] Each file now begins with `@layer components {` and ends with `}`

---

## Phase 6 — Guardrails
Add two scripts to enforce isolation:

1) **No legacy imports outside `(site)/layout.tsx`**  
`scripts/check-legacy-imports.mjs`  
- Scans `src/app/**` for `styles/components/` imports; allowlist only `src/app/(site)/layout.tsx`.

2) **All legacy CSS layered**  
`scripts/check-legacy-layering.mjs`  
- Scans `src/styles/components/*.css` for `@layer`.

Add to `package.json`:
```json
{
  "scripts": {
    "guard:legacy-imports": "node scripts/check-legacy-imports.mjs",
    "guard:legacy-layering": "node scripts/check-legacy-layering.mjs",
    "guard:all": "npm run guard:legacy-imports && npm run guard:legacy-layering"
  }
}

Verification
	•	npm run guard:all passes

⸻

Phase 7 — Cascade order

Ensure src/styles/tokens/theme.css declares the canonical @layer line once near the top.

Verification
	•	@layer reset, tokens, primitives, recipes, components-legacy, components, utilities; exists
	•	No duplicate global @layer orders in other files

⸻

Phase 8 — Component migration loop (repeat per section)
	1.	Build new component in (migration) using primitives only.
	2.	QA density tiers (<380px compact, default, >900px spacious).
	3.	Replace legacy usage on (site) (one section at a time).
	4.	Remove that component’s legacy import from (site)/layout.tsx.
	5.	Run npm run guard:all.
	6.	Visual regression sweep (key breakpoints).
	7.	Commit with message migrate(<component>): primitives version; drop legacy css.

Verification
	•	Section looks correct on (site) and (migration)
	•	Guardrails pass

⸻

Phase 9 — Cleanup (endgame)
	•	Once all legacy imports are removed from (site)/layout.tsx, delete src/styles/components/**.
	•	Optionally fold (site) back into the root tree and remove the group if desired.

⸻

Quick commands (reference)

Find any accidental legacy import outside (site)

rg "styles/components/" src/app --glob '!src/app/(site)/**' --color=never

Confirm unlayered CSS

rg -n --invert-match "@layer" src/styles/components/*.css


⸻

Rollback plan
	•	git reset --hard HEAD~1 to undo the last step if needed
	•	git switch - to hop back to main if necessary
	•	Always work on chore/migrate-clean-room until complete

⸻

Pinned docs
	•	Next.js Route Groups: https://nextjs.org/docs/app/building-your-application/routing/route-groups
	•	Next.js Layouts & nesting: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
	•	CSS @layer: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
MD