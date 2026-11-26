/* eslint-disable @typescript-eslint/no-require-imports */
import { AppState, Platform } from 'react-native';
import { linkAppsFlyer } from './purchases';

const DEV_KEY = process.env.EXPO_PUBLIC_APPSFLYER_DEV_KEY ?? '';
const IOS_APP_ID = '6836514358';

let asked: Promise<void> | null = null;
let started: Promise<void> | null = null;

function whenActive(): Promise<void> {
  if (AppState.currentState === 'active') return Promise.resolve();
  return new Promise((resolve) => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      sub.remove();
      resolve();
    });
  });
}

async function requestTracking(): Promise<void> {
  if (Platform.OS !== 'ios') return;
  const { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } =
    require('expo-tracking-transparency') as typeof import('expo-tracking-transparency');
  const current = await getTrackingPermissionsAsync();
  if (current.status !== 'undetermined' || !current.canAskAgain) return;
  await whenActive();
  await requestTrackingPermissionsAsync();
}

function startAppsFlyer(): Promise<string | null> {
  const { AppsFlyer } = require('react-native-appsflyer') as typeof import('react-native-appsflyer');
  return new Promise((resolve) => {
    AppsFlyer.init({ devKey: DEV_KEY, appId: Platform.OS === 'ios' ? IOS_APP_ID : null }).catch((e: unknown) => {
      console.warn('[attribution] init failed', e);
      resolve(null);
    });
    AppsFlyer.registerSessionReadyListener(() => {
      AppsFlyer.start()
        .then(() => AppsFlyer.getAppsFlyerUID())
        .then(resolve, (e: unknown) => {
          console.warn('[attribution] start failed', e);
          resolve(null);
        });
    }).catch((e: unknown) => {
      console.warn('[attribution] session listener failed', e);
      resolve(null);
    });
  });
}

export function askTracking(): Promise<void> {
  if (!asked) {
    asked = requestTracking().catch((e: unknown) => console.warn('[attribution] tracking request failed', e));
  }
  return asked;
}

async function run(): Promise<void> {
  await askTracking();
  if (!DEV_KEY) return;
  const uid = await startAppsFlyer();
  if (uid) await linkAppsFlyer(uid);
}

export function startAttribution(): Promise<void> {
  if (!started) started = run();
  return started;
}
