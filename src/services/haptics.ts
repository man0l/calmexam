import * as Haptics from 'expo-haptics';

export function tapHaptic(): void {
  Haptics.selectionAsync().catch(() => {});
}

export function resultHaptic(correct: boolean): void {
  Haptics.notificationAsync(
    correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
  ).catch(() => {});
}
