export const REMINDERS_SUPPORTED = false;
export const REMINDER_HOUR = 21;

export interface ReminderState {
  enabled: boolean;
}

export async function loadReminder(): Promise<ReminderState> {
  return { enabled: false };
}

export async function enableReminder(): Promise<'enabled' | 'denied'> {
  return 'denied';
}

export async function disableReminder(): Promise<void> {}

export function onReminderTap(_cb: () => void): () => void {
  return () => undefined;
}
