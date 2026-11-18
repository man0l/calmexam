import type { EdgeInsets } from 'react-native-safe-area-context';
import { parseDemo, type DemoConfig } from './demoIds';

export type { DemoConfig, DemoId } from './demoIds';

export function readDemoConfig(): DemoConfig | null {
  if (typeof window === 'undefined') return null;
  return parseDemo(new URLSearchParams(window.location.search).get('demo'));
}

// ?insets=top,right,bottom,left fakes device safe-area insets so the safe-area
// audit (scripts/safe-area-audit.mjs) can render notch / home-indicator layouts.
export function readDemoInsets(): EdgeInsets | null {
  if (typeof window === 'undefined') return null;
  const raw = new URLSearchParams(window.location.search).get('insets');
  const n = raw?.split(',').map(Number);
  if (!n || n.length !== 4 || n.some((v) => !Number.isFinite(v) || v < 0)) return null;
  const [top, right, bottom, left] = n;
  return { top, right, bottom, left };
}
