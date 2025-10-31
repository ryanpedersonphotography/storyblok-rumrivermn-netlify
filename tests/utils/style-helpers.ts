import { Locator, Page } from '@playwright/test';

export type StyleMap = Record<string, string>;

export async function readComputed(locator: Locator, props: string[]): Promise<StyleMap> {
  return await locator.evaluate((el, props) => {
    const cs = getComputedStyle(el as Element);
    const out: Record<string, string> = {};
    for (const p of props as string[]) {
      out[p] = cs.getPropertyValue(p) || (cs as any)[p] || '';
    }
    return out;
  }, props);
}

export function toPx(value: string, base = 16): number {
  if (!value) return 0;
  const v = value.trim();
  if (v.endsWith('px')) return parseFloat(v);
  if (v.endsWith('rem')) return parseFloat(v) * base;
  if (v.endsWith('em')) return parseFloat(v) * base; // rough; ok for tests
  const num = parseFloat(v);
  return isFinite(num) ? num : 0;
}

export function normalizeColor(v: string): string {
  if (!v) return '';
  // browser already returns rgb/rgba for computed colors; trim spaces
  return v.replace(/\s+/g, ' ').trim();
}

export async function beforeAfterBackground(locator: Locator) {
  return await locator.evaluate((el) => {
    const before = getComputedStyle(el as Element, '::before').backgroundImage || '';
    const after  = getComputedStyle(el as Element, '::after').backgroundImage || '';
    return { before, after };
  });
}

export async function bbox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) return { x:0,y:0,width:0,height:0 };
  return box;
}

export function near(a: number, b: number, tol = 2) {
  return Math.abs(a - b) <= tol;
}
