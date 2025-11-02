#!/usr/bin/env node

/**
 * CI Guardrail: Container Query Policy Enforcement
 *
 * Ensures all responsive CSS uses container queries (composition-first)
 * instead of viewport media queries. Viewport MQs are only allowed as
 * fallbacks inside @supports not (container-type: inline-size) blocks.
 *
 * Usage:
 *   npm run lint:cq
 *   node scripts/check-container-queries.mjs
 *
 * Exit codes:
 *   0 - Success (no violations)
 *   1 - Violations found (CI should fail)
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Configuration
const CSS_DIRS = [
  join(projectRoot, 'src/styles/components'),
  join(projectRoot, 'src/styles/primitives'),
]

const ALLOWED_VIEWPORT_MQ_FILES = [
  'src/styles/tokens/theme.css', // Base theme can have viewport MQs
  'src/styles/system/reset.css', // Reset CSS can have viewport MQs
]

// ANSI color codes for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

/**
 * Recursively find all CSS files in a directory
 */
function findCSSFiles(dir, files = []) {
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      findCSSFiles(fullPath, files)
    } else if (entry.endsWith('.css')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Check if a viewport media query is inside a @supports fallback block
 */
function isInSupportsFallback(content, mediaQueryIndex) {
  // Find the nearest @supports before this media query
  const beforeContent = content.substring(0, mediaQueryIndex)

  // Look for @supports not (container-type: inline-size)
  const supportsPattern = /@supports\s+not\s+\(container-type:\s*inline-size\)/gi
  const supportsMatches = [...beforeContent.matchAll(supportsPattern)]

  if (supportsMatches.length === 0) {
    return false
  }

  // Get the last @supports block before this media query
  const lastSupports = supportsMatches[supportsMatches.length - 1]
  const supportsStart = lastSupports.index

  // Count braces to see if we're inside the @supports block
  let braceCount = 0
  let inSupportsBlock = false

  for (let i = supportsStart; i < mediaQueryIndex; i++) {
    if (content[i] === '{') {
      braceCount++
      if (braceCount === 1) inSupportsBlock = true
    } else if (content[i] === '}') {
      braceCount--
      if (braceCount === 0) inSupportsBlock = false
    }
  }

  return inSupportsBlock
}

/**
 * Check a single CSS file for viewport media query violations
 */
function checkFile(filePath) {
  const relativePath = relative(projectRoot, filePath)

  // Skip allowed files
  if (ALLOWED_VIEWPORT_MQ_FILES.some(allowed => relativePath.includes(allowed))) {
    return { violations: [], warnings: [] }
  }

  const content = readFileSync(filePath, 'utf-8')
  const violations = []
  const warnings = []

  // Pattern: @media with width-based queries (viewport MQs)
  const viewportMQPattern = /@media\s*\([^)]*(?:min-width|max-width|width)[^)]*\)/gi
  const matches = [...content.matchAll(viewportMQPattern)]

  for (const match of matches) {
    const line = content.substring(0, match.index).split('\n').length
    const isInFallback = isInSupportsFallback(content, match.index)

    if (!isInFallback) {
      violations.push({
        file: relativePath,
        line,
        code: match[0],
        message: 'Viewport media query found outside @supports fallback',
      })
    }
  }

  // Check for container queries (informational)
  const containerQPattern = /@container\s+[a-z-]+\s*\([^)]*(?:min-width|max-width|width)[^)]*\)/gi
  const containerMatches = [...content.matchAll(containerQPattern)]

  if (containerMatches.length === 0 && matches.length === 0) {
    warnings.push({
      file: relativePath,
      message: 'No container queries or media queries found. Consider using container queries for responsive design.',
    })
  }

  return { violations, warnings }
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bold}${colors.cyan}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Container Query Policy Enforcement')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`${colors.reset}\n`)

  console.log(`${colors.blue}Scanning directories:${colors.reset}`)
  CSS_DIRS.forEach(dir => {
    console.log(`  • ${relative(projectRoot, dir)}`)
  })
  console.log()

  // Collect all CSS files
  const allFiles = []
  for (const dir of CSS_DIRS) {
    findCSSFiles(dir, allFiles)
  }

  console.log(`${colors.blue}Found ${allFiles.length} CSS files${colors.reset}\n`)

  // Check each file
  const allViolations = []
  const allWarnings = []
  let filesChecked = 0

  for (const file of allFiles) {
    const { violations, warnings } = checkFile(file)

    if (violations.length > 0) {
      allViolations.push(...violations)
    }

    if (warnings.length > 0) {
      allWarnings.push(...warnings)
    }

    filesChecked++
  }

  // Report results
  console.log(`${colors.bold}Results:${colors.reset}`)
  console.log(`  Files checked: ${filesChecked}`)
  console.log(`  Violations: ${allViolations.length}`)
  console.log(`  Warnings: ${allWarnings.length}`)
  console.log()

  // Display violations
  if (allViolations.length > 0) {
    console.log(`${colors.bold}${colors.red}❌ VIOLATIONS FOUND:${colors.reset}\n`)

    for (const violation of allViolations) {
      console.log(`${colors.red}✗${colors.reset} ${colors.bold}${violation.file}:${violation.line}${colors.reset}`)
      console.log(`  ${violation.message}`)
      console.log(`  ${colors.yellow}${violation.code}${colors.reset}`)
      console.log()
    }

    console.log(`${colors.red}${colors.bold}Policy:${colors.reset}`)
    console.log(`  Viewport media queries MUST be wrapped in:`)
    console.log(`  ${colors.cyan}@supports not (container-type: inline-size) { ... }${colors.reset}`)
    console.log()
    console.log(`  Prefer container queries for composition-first responsive design:`)
    console.log(`  ${colors.green}@container section (max-width: var(--cq-md)) { ... }${colors.reset}`)
    console.log()

    process.exit(1)
  }

  // Display warnings (don't fail CI)
  if (allWarnings.length > 0) {
    console.log(`${colors.yellow}⚠ Warnings:${colors.reset}\n`)

    for (const warning of allWarnings) {
      console.log(`${colors.yellow}⚠${colors.reset} ${warning.file}`)
      console.log(`  ${warning.message}`)
      console.log()
    }
  }

  // Success
  console.log(`${colors.green}${colors.bold}✓ All checks passed!${colors.reset}`)
  console.log(`${colors.green}Container query policy is being followed.${colors.reset}\n`)

  process.exit(0)
}

main()
