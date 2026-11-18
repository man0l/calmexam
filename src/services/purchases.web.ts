import type { PlanId, PlanOption } from '../types';
import { DEFAULT_PLANS, ENTITLEMENT_ID, type PurchaseResult } from './purchaseCommon';

export { ENTITLEMENT_ID };
export type { PurchaseResult };

let stubPro = false;

export function isStubBilling(): boolean {
  return true;
}

export async function configurePurchases(): Promise<boolean> {
  return true;
}

export async function fetchIsPro(): Promise<boolean> {
  return stubPro;
}

export async function fetchPlans(): Promise<{ plans: PlanOption[]; error: string | null }> {
  return { plans: DEFAULT_PLANS, error: null };
}

export async function purchasePlan(_plan: PlanId): Promise<PurchaseResult> {
  stubPro = true;
  return { pro: true, cancelled: false, error: null };
}

export async function restorePurchases(): Promise<PurchaseResult> {
  return stubPro
    ? { pro: true, cancelled: false, error: null }
    : { pro: false, cancelled: false, error: 'No active subscription found.' };
}

export function addProListener(_cb: (pro: boolean) => void): () => void {
  return () => {};
}

export async function presentCustomerCenter(): Promise<void> {
  if (typeof window !== 'undefined') {
    window.open('https://apps.apple.com/account/subscriptions', '_blank', 'noopener,noreferrer');
  }
}
