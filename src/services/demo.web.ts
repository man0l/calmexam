import { parseDemo, type DemoConfig } from './demoIds';

export type { DemoConfig, DemoId } from './demoIds';

export function readDemoConfig(): DemoConfig | null {
  if (typeof window === 'undefined') return null;
  return parseDemo(new URLSearchParams(window.location.search).get('demo'));
}
