import { Platform } from 'react-native';
import * as StoreReview from 'expo-store-review';

export async function requestStoreReview(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    if (!(await StoreReview.isAvailableAsync())) return false;
    await StoreReview.requestReview();
    return true;
  } catch {
    return false;
  }
}
