#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import postcss from 'postcss';
import safe from 'postcss-safe-parser';
import pc from 'picocolors';

/* ===================== Policy ===================== */
const FILE_GLOBS = ['src/styles/**/*.css'];
const ALLOWED_CONTAINERS = new Set(['section', 'section-content']);
const ALLOWED_BY_FILE = {
  // 'src/styles/components/card.css': new Set(['section','section-content','card'])
};
const ENFORCE_MIN_WIDTH_ONLY = true;
const REQUIRE_TOKENIZED_WIDTHS = true;
const PRAGMA_ALLOW_MAX_WIDTH = 'cq:allow-max-width';

/* precise match: @supports not (container-type: inline-size) */
const SUPPORTS_NOT_CQ_RE = /not\s*\(\s*container-type\s*:\s*inline-size\s*\)/i;
const MEDIA_WIDTH_RE = /\(\s*(min|max)-width\s*:\s*[^)]+\)/i;
const TOKEN_RE = /var\(\s*--cq-(xs|sm|md|lg|xl|navbar-min|xl-nav-gap)\b/i;

function isViewportWidthMedia(at) {
  return at.name === 'media' && MEDIA_WIDTH_RE.test(at.params || '');
}
function isSupportsNotCQ(at) {
  return at.name === 'supports' && SUPPORTS_NOT_CQ_RE.test(at.params || '');
}
function hasAncestor(node, pred) {
  let p = node.parent;
  while (p) { if (pred(p)) return true; p = p.parent; }
  return false;
}
function loc(node) {
  const s = node?.source?.start;
  return s ? `${s.line}:${s.column}` : '?:?';
}
function beforeHasPragma(node, pragma) {
  const parent = node.parent;
  if (!parent?.nodes) return false;
  const idx = parent.nodes.indexOf(node);
  for (let i = idx - 1; i >= 0; i--) {
    const n = parent.nodes[i];
    if (n.type === 'comment' && String(n.text).includes(pragma)) return true;
    if (n.type === 'atrule' || n.type === 'rule') break;
  }
  if (node.raws?.before && String(node.raws.before).includes(pragma)) return true;
  return false;
}
function parseContainerParams(params) {
  // "section (min-width: var(--cq-md))"
  // "section (max-width: var(--cq-xs))"
  const name = (params.match(/^\s*([a-zA-Z-]+)\s*\(/) || [])[1] || null;
  const inner = params.slice(params.indexOf('(') + 1, params.lastIndexOf(')'));
  const km = inner.match(/\b(min|max)-width\s*:\s*([^)]+)\)/i) || inner.match(/\b(min|max)-width\s*:\s*([^)]+)$/i);
  const kind = km ? km[1].toLowerCase() : null;
  const value = km ? km[2].trim() : null;
  return { name, kind, value };
}
function err(file, node, msg) {
  console.log(pc.red(`✗ ${file}:${loc(node)} ${msg}`));
  return 1;
}
function info(file, node, msg) {
  console.log(pc.gray(`• ${file}:${loc(node)} ${msg}`));
}

/* ===================== Check ===================== */
function checkFile(absPath) {
  const rel = path.relative(process.cwd(), absPath);
  const css = fs.readFileSync(absPath, 'utf8');
  const root = postcss.parse(css, { parser: safe, from: rel });
  let violations = 0;

  const allowedHere = new Set([...ALLOWED_CONTAINERS, ...(ALLOWED_BY_FILE[rel] || [])]);

  root.walkAtRules(at => {
    // Rule 1: viewport @media must be inside @supports not(CQ)
    if (isViewportWidthMedia(at) && !hasAncestor(at, isSupportsNotCQ)) {
      violations += err(rel, at, '@media (min|max-width: …) must be inside @supports not (container-type: inline-size)');
    }

    // Rules 2-4: @container validations
    if (at.name === 'container') {
      const { name, kind, value } = parseContainerParams(at.params || '');

      if (!name || !allowedHere.has(name)) {
        violations += err(rel, at, `@container must target an allowed named container (${[...allowedHere].join(', ')}) — found "${name || 'none'}"`);
      }
      if (REQUIRE_TOKENIZED_WIDTHS && value && !TOKEN_RE.test(value)) {
        violations += err(rel, at, `@container width must use var(--cq-*) token — found "${value}"`);
      }
      if (ENFORCE_MIN_WIDTH_ONLY && kind === 'max' && !beforeHasPragma(at, PRAGMA_ALLOW_MAX_WIDTH)) {
        violations += err(rel, at, `Use min-width (mobile-first). Max-width requires /* ${PRAGMA_ALLOW_MAX_WIDTH} */ with justification.`);
      }
    }
  });

  if (violations === 0) info(rel, root, 'No policy violations.');
  return violations;
}

/* ===================== Main ===================== */
async function main() {
  console.log(pc.cyan('🔍 Container Query Policy Checker (PostCSS AST)\n'));
  const files = await fg(FILE_GLOBS, { absolute: true });
  let total = 0;
  for (const f of files) total += checkFile(f);
  if (total > 0) {
    console.log('\n' + pc.red(`Failed with ${total} violation${total === 1 ? '' : 's'}.`));
    console.log(pc.dim('\nPolicy:'));
    console.log(pc.dim(' 1) Viewport @media (width) only inside @supports not (container-type: inline-size)'));
    console.log(pc.dim(' 2) @container must target allowed names'));
    console.log(pc.dim(' 3) Widths must use var(--cq-*) tokens'));
    console.log(pc.dim(` 4) min-width default; max-width needs /* ${PRAGMA_ALLOW_MAX_WIDTH} */`));
    process.exit(1);
  }
  console.log(pc.green('\n✓ All CSS files comply with container query policy.'));
}
main().catch(e => { console.error(pc.red('Fatal error:'), e); process.exit(1); });
