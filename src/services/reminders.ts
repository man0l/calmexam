import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { loadJson, saveJson, STORAGE_KEYS } from './storage';

export const REMINDERS_SUPPORTED = true;
export const REMINDER_HOUR = 21;
const ID = 'evening-problem';
const CHANNEL = 'reminders';

export interface ReminderState {
  enabled: boolean;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function loadReminder(): Promise<ReminderState> {
  return (await loadJson<ReminderState>(STORAGE_KEYS.reminder)) ?? { enabled: false };
}

export async function enableReminder(): Promise<'enabled' | 'denied'> {
  const current = await Notifications.getPermissionsAsync();
  const granted = current.granted || (current.canAskAgain && (await Notifications.requestPermissionsAsync()).granted);
  if (!granted) return 'denied';
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Evening problem',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  await Notifications.cancelScheduledNotificationAsync(ID).catch(() => undefined);
  await Notifications.scheduleNotificationAsync({
    identifier: ID,
    content: {
      title: 'One problem, then sleep',
      body: 'A single verified question from your weakest topic. About two minutes.',
      data: { kind: 'night' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: REMINDER_HOUR,
      minute: 0,
      channelId: CHANNEL,
    },
  });
  await saveJson<ReminderState>(STORAGE_KEYS.reminder, { enabled: true });
  return 'enabled';
}

export async function disableReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(ID).catch(() => undefined);
  await saveJson<ReminderState>(STORAGE_KEYS.reminder, { enabled: false });
}

const handled = new Set<string>();

export function onReminderTap(cb: () => void): () => void {
  const handle = (r: Notifications.NotificationResponse | null) => {
    if (!r || r.notification.request.identifier !== ID) return;
    const key = `${r.notification.request.identifier}:${r.notification.date}`;
    if (handled.has(key)) return;
    handled.add(key);
    cb();
  };
  handle(Notifications.getLastNotificationResponse());
  const sub = Notifications.addNotificationResponseReceivedListener(handle);
  return () => sub.remove();
}
