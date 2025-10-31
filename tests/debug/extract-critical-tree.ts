import { Page } from '@playwright/test';
import { IGNORE, PROPS, weightOf } from './property-weights';

export type NodeReport = {
  selector: string;
  styles: Record<string,string>;
  rect: { x:number;y:number;width:number;height:number };
};

export async function extractCriticalTree(
  page: Page,
  rootSelector: string,
  criticalSelectors: string[],
  props: string[]
): Promise<NodeReport[]> {
  // Dedup props & filter ignored
  const want = Array.from(new Set(props)).filter(p => !IGNORE.includes(p));

  return await page.evaluate(({ rootSelector, criticalSelectors, want }) => {
    function read(el: Element, props: string[]) {
      const cs = getComputedStyle(el);
      const out: Record<string,string> = {};
      for (const p of props) out[p] = cs.getPropertyValue(p) || (cs as any)[p] || '';
      const r = (el as HTMLElement).getBoundingClientRect();
      return { styles: out, rect: { x: r.x, y: r.y, width: r.width, height: r.height } };
    }

    const root = document.querySelector(rootSelector) as Element | null;
    if (!root) return [];

    const nodes: NodeReport[] = [];
    for (const sel of criticalSelectors) {
      const el = root.querySelector(sel);
      if (!el) continue;
      const { styles, rect } = read(el, want);
      nodes.push({ selector: sel, styles, rect } as any);
    }
    return nodes as any;
  }, { rootSelector, criticalSelectors, want });
}

export function severityScore(a: Record<string,string>, b: Record<string,string>): number {
  let score = 0;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const wa = weightOf(k);
    if (!wa) continue;
    if ((a[k] || '').trim() !== (b[k] || '').trim()) score += wa;
  }
  return score;
}
