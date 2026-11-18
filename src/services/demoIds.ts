export const ONBOARDING_DEMO_IDS = ['onboarding', 'exam', 'date', 'placement', 'plan'] as const;
export const APP_DEMO_IDS = ['1', 'today', 'practice', 'progress', 'settings', 'answer', 'explain', 'paywall'] as const;

export type DemoId = (typeof ONBOARDING_DEMO_IDS)[number] | (typeof APP_DEMO_IDS)[number];

export interface DemoConfig {
  id: DemoId;
  onboarding: boolean;
}

export function parseDemo(value: string | null): DemoConfig | null {
  if (!value) return null;
  if ((ONBOARDING_DEMO_IDS as readonly string[]).includes(value)) return { id: value as DemoId, onboarding: true };
  if ((APP_DEMO_IDS as readonly string[]).includes(value)) return { id: value as DemoId, onboarding: false };
  return null;
}
