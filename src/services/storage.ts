import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  profile: 'calmexam-profile-v1',
  progress: 'calmexam-progress-v1',
  entitlement: 'calmexam-entitlement-v1',
} as const;

export async function loadJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function saveJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function removeKeys(keys: string[]): Promise<void> {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch {}
}
