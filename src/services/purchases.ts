/* eslint-disable @typescript-eslint/no-require-imports */
import { Platform } from 'react-native';
import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import type { PlanId, PlanOption } from '../types';
import { DEFAULT_PLANS, ENTITLEMENT_ID, PACKAGE_TYPE, type PurchaseResult } from './purchaseCommon';

export { ENTITLEMENT_ID };
export type { PurchaseResult };

const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_KEY ?? '';
const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const PLATFORM_KEY = Platform.OS === 'ios' && IOS_KEY ? IOS_KEY : ANDROID_KEY;
const TEST_STORE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_TEST_STORE_KEY ?? '';
const API_KEY = __DEV__ && TEST_STORE_KEY ? TEST_STORE_KEY : PLATFORM_KEY;

const stubBilling = __DEV__ && !API_KEY;

type PurchasesModule = typeof import('react-native-purchases').default;

function getPurchases(): PurchasesModule {
  return require('react-native-purchases').default;
}

let configured = false;
let offering: PurchasesOffering | null = null;
let stubPro = false;

export function isStubBilling(): boolean {
  return stubBilling;
}

export async function configurePurchases(): Promise<boolean> {
  if (stubBilling) return true;
  if (configured) return true;
  if (!API_KEY) {
    console.warn('[purchases] no RevenueCat key configured');
    return false;
  }
  try {
    const Purchases = getPurchases();
    if (__DEV__) {
      const { LOG_LEVEL } = require('react-native-purchases');
      await Purchases.setLogLevel(LOG_LEVEL.WARN);
    }
    Purchases.configure({ apiKey: API_KEY });
    configured = true;
    if (Platform.OS === 'ios') {
      Purchases.enableAdServicesAttributionTokenCollection().catch((e) =>
        console.warn('[purchases] AdServices token collection failed', e),
      );
    }
  } catch (e) {
    console.warn('[purchases] configure failed', e);
  }
  return configured;
}

function isProActive(info: CustomerInfo | null): boolean {
  return info?.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export async function fetchIsPro(): Promise<boolean> {
  if (stubBilling) return stubPro;
  if (!configured) return false;
  try {
    return isProActive(await getPurchases().getCustomerInfo());
  } catch (e) {
    console.warn('[purchases] getCustomerInfo failed', e);
    return false;
  }
}

function packageFor(plan: PlanId): PurchasesPackage | null {
  return offering?.availablePackages.find((p) => (p.packageType as string) === PACKAGE_TYPE[plan]) ?? null;
}

export async function fetchPlans(): Promise<{ plans: PlanOption[]; error: string | null }> {
  if (stubBilling || !configured) return { plans: DEFAULT_PLANS, error: null };
  try {
    const offerings = await getPurchases().getOfferings();
    offering = offerings.current;
    if (!offering) return { plans: DEFAULT_PLANS, error: 'No subscription plans are available yet.' };
    const plans = DEFAULT_PLANS.map((fallback) => {
      const pkg = packageFor(fallback.id);
      if (!pkg) return fallback;
      return {
        id: fallback.id,
        priceString: pkg.product.priceString,
        price: pkg.product.price,
        currencyCode: pkg.product.currencyCode,
      };
    });
    return { plans, error: null };
  } catch (e) {
    console.warn('[purchases] getOfferings failed', e);
    return { plans: DEFAULT_PLANS, error: "Couldn't load plans. Check your connection and try again." };
  }
}

let billingInFlight = false;

async function guarded(run: () => Promise<PurchaseResult>): Promise<PurchaseResult> {
  if (billingInFlight) return { pro: false, cancelled: true, error: null };
  billingInFlight = true;
  try {
    return await run();
  } finally {
    billingInFlight = false;
  }
}

export function purchasePlan(plan: PlanId): Promise<PurchaseResult> {
  return guarded(async () => {
    if (stubBilling) {
      stubPro = true;
      return { pro: true, cancelled: false, error: null };
    }
    if (!configured) return { pro: false, cancelled: false, error: 'Purchases are not available right now.' };
    if (!offering) await fetchPlans();
    const pkg = packageFor(plan);
    if (!pkg) return { pro: false, cancelled: false, error: 'This plan is unavailable right now. Please try again later.' };
    try {
      const { customerInfo } = await getPurchases().purchasePackage(pkg);
      return { pro: isProActive(customerInfo), cancelled: false, error: null };
    } catch (e) {
      const err = e as { userCancelled?: boolean; message?: string };
      if (err.userCancelled) return { pro: false, cancelled: true, error: null };
      console.warn('[purchases] purchase failed', e);
      return { pro: false, cancelled: false, error: err.message ?? 'Purchase failed. Please try again.' };
    }
  });
}

export function restorePurchases(): Promise<PurchaseResult> {
  return guarded(async () => {
    if (stubBilling) {
      return stubPro
        ? { pro: true, cancelled: false, error: null }
        : { pro: false, cancelled: false, error: 'No active subscription found.' };
    }
    if (!configured) return { pro: false, cancelled: false, error: 'Purchases are not available right now.' };
    try {
      const info = await getPurchases().restorePurchases();
      if (isProActive(info)) return { pro: true, cancelled: false, error: null };
      return {
        pro: false,
        cancelled: false,
        error: `No active subscription found for this ${Platform.OS === 'ios' ? 'Apple ID' : 'account'}.`,
      };
    } catch (e) {
      const err = e as { message?: string };
      console.warn('[purchases] restore failed', e);
      return { pro: false, cancelled: false, error: err.message ?? 'Restore failed. Please try again.' };
    }
  });
}

export function addProListener(cb: (pro: boolean) => void): () => void {
  if (stubBilling || !configured) return () => {};
  const Purchases = getPurchases();
  const listener = (info: CustomerInfo) => cb(isProActive(info));
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(listener);
  };
}

export async function presentCustomerCenter(): Promise<void> {
  if (stubBilling || !configured) return;
  try {
    const RevenueCatUI = require('react-native-purchases-ui').default;
    await RevenueCatUI.presentCustomerCenter();
  } catch (e) {
    console.warn('[purchases] Customer Center failed', e);
  }
}
