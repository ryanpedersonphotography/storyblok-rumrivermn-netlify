/**
 * Utility to compare computed CSS styles between two implementations
 * Uses 1% tolerance for numeric values to account for rounding differences
 */

import { ExtractedStyles } from './extract-styles';

export interface StyleDifference {
  property: string;
  hotfixValue: string;
  cleanValue: string;
  percentDiff?: number;
  severity: 'match' | 'minor' | 'warning' | 'critical';
}

export interface ComparisonResult {
  section: string;
  timestamp: string;
  hotfixUrl: string;
  cleanUrl: string;
  matches: StyleDifference[];
  differences: StyleDifference[];
  summary: {
    totalProperties: number;
    matches: number;
    differences: number;
    minorDiffs: number;
    warningDiffs: number;
    criticalDiffs: number;
  };
}

/**
 * Extract numeric value from CSS property (e.g., "16px" -> 16)
 * @param value - CSS value string
 * @returns Numeric value or null if not a number
 */
function extractNumericValue(value: string | undefined): number | null {
  if (!value) return null;

  // Handle values like "16px", "1.5rem", "50%", etc.
  const match = value.match(/^(-?\d+\.?\d*)/);

  if (match) {
    return parseFloat(match[1]);
  }

  return null;
}

/**
 * Check if two numeric values are within 1% tolerance
 * @param value1 - First value
 * @param value2 - Second value
 * @returns true if within tolerance, false otherwise
 */
function isWithinTolerance(value1: number, value2: number): boolean {
  if (value1 === 0 && value2 === 0) return true;
  if (value1 === 0 || value2 === 0) return false;

  const diff = Math.abs(value1 - value2);
  const percentDiff = (diff / Math.abs(value1)) * 100;

  return percentDiff <= 1;
}

/**
 * Calculate percentage difference between two numeric values
 * @param value1 - First value (reference)
 * @param value2 - Second value
 * @returns Percentage difference
 */
function calculatePercentDiff(value1: number, value2: number): number {
  if (value1 === 0 && value2 === 0) return 0;
  if (value1 === 0) return 100;

  return (Math.abs(value1 - value2) / Math.abs(value1)) * 100;
}

/**
 * Normalize color values to RGB format for comparison
 * @param color - Color string (any CSS format)
 * @returns Normalized RGB string or original if not parseable
 */
function normalizeColor(color: string | undefined): string {
  if (!color) return '';

  // Already in rgb/rgba format
  if (color.startsWith('rgb')) {
    // Normalize spacing
    return color.replace(/\s+/g, '');
  }

  // Hex colors - keep as is for now (could convert to RGB if needed)
  if (color.startsWith('#')) {
    return color.toLowerCase();
  }

  // Named colors - keep as is
  return color.toLowerCase();
}

/**
 * Determine severity of style difference
 * @param property - CSS property name
 * @param percentDiff - Percentage difference (if numeric)
 * @returns Severity level
 */
function determineSeverity(
  property: string,
  percentDiff?: number
): 'match' | 'minor' | 'warning' | 'critical' {
  // Properties that should match exactly
  const criticalProperties = ['display', 'position', 'fontFamily'];

  if (criticalProperties.includes(property)) {
    return 'critical';
  }

  // Numeric comparison
  if (percentDiff !== undefined) {
    if (percentDiff === 0) return 'match';
    if (percentDiff <= 1) return 'minor';
    if (percentDiff <= 5) return 'warning';
    return 'critical';
  }

  // Non-numeric - any difference is a warning
  return 'warning';
}

/**
 * Compare two style objects
 * @param hotfixStyles - Styles from hotfix version
 * @param cleanStyles - Styles from clean version
 * @param tolerance - Tolerance percentage (default: 1)
 * @returns Array of style differences
 */
function compareStyleObjects(
  hotfixStyles: ExtractedStyles,
  cleanStyles: ExtractedStyles,
  tolerance: number = 1
): StyleDifference[] {
  const differences: StyleDifference[] = [];

  // Get all unique properties
  const allProperties = new Set([
    ...Object.keys(hotfixStyles),
    ...Object.keys(cleanStyles),
  ]);

  for (const property of allProperties) {
    const hotfixValue = (hotfixStyles as any)[property];
    const cleanValue = (cleanStyles as any)[property];

    // Skip undefined values
    if (hotfixValue === undefined && cleanValue === undefined) {
      continue;
    }

    // Exact match
    if (hotfixValue === cleanValue) {
      differences.push({
        property,
        hotfixValue,
        cleanValue,
        severity: 'match',
      });
      continue;
    }

    // Try numeric comparison
    const hotfixNum = extractNumericValue(hotfixValue);
    const cleanNum = extractNumericValue(cleanValue);

    if (hotfixNum !== null && cleanNum !== null) {
      const percentDiff = calculatePercentDiff(hotfixNum, cleanNum);
      const severity =
        percentDiff <= tolerance ? 'minor' : determineSeverity(property, percentDiff);

      differences.push({
        property,
        hotfixValue,
        cleanValue,
        percentDiff,
        severity,
      });
      continue;
    }

    // Color comparison
    if (property.includes('color') || property.includes('Color')) {
      const normalizedHotfix = normalizeColor(hotfixValue);
      const normalizedClean = normalizeColor(cleanValue);

      if (normalizedHotfix === normalizedClean) {
        differences.push({
          property,
          hotfixValue,
          cleanValue,
          severity: 'match',
        });
        continue;
      }
    }

    // Default: mark as difference
    differences.push({
      property,
      hotfixValue,
      cleanValue,
      severity: determineSeverity(property),
    });
  }

  return differences;
}

/**
 * Compare styles between hotfix and clean implementations
 * @param sectionName - Name of the section being compared
 * @param hotfixUrl - URL of hotfix version
 * @param cleanUrl - URL of clean version
 * @param hotfixStyles - Extracted styles from hotfix
 * @param cleanStyles - Extracted styles from clean
 * @param tolerance - Tolerance percentage (default: 1)
 * @returns Comparison result object
 */
export function compareStyles(
  sectionName: string,
  hotfixUrl: string,
  cleanUrl: string,
  hotfixStyles: ExtractedStyles,
  cleanStyles: ExtractedStyles,
  tolerance: number = 1
): ComparisonResult {
  const differences = compareStyleObjects(hotfixStyles, cleanStyles, tolerance);

  const matches = differences.filter((d) => d.severity === 'match');
  const diffs = differences.filter((d) => d.severity !== 'match');

  const minorDiffs = diffs.filter((d) => d.severity === 'minor').length;
  const warningDiffs = diffs.filter((d) => d.severity === 'warning').length;
  const criticalDiffs = diffs.filter((d) => d.severity === 'critical').length;

  return {
    section: sectionName,
    timestamp: new Date().toISOString(),
    hotfixUrl,
    cleanUrl,
    matches,
    differences: diffs,
    summary: {
      totalProperties: differences.length,
      matches: matches.length,
      differences: diffs.length,
      minorDiffs,
      warningDiffs,
      criticalDiffs,
    },
  };
}
