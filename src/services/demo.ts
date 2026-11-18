import type { EdgeInsets } from 'react-native-safe-area-context';
import type { DemoConfig } from './demoIds';

export type { DemoConfig, DemoId } from './demoIds';

export function readDemoConfig(): DemoConfig | null {
  return null;
}

export function readDemoInsets(): EdgeInsets | null {
  return null;
}
