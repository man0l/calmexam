import type { PlanId, PlanOption } from '../types';

export const ENTITLEMENT_ID = 'pro';
export const DEFAULT_TRIAL_DAYS = 7;

export const DEFAULT_PLANS: PlanOption[] = [
  { id: 'annual', priceString: '$49.99', price: 49.99, currencyCode: 'USD', trialDays: DEFAULT_TRIAL_DAYS },
  { id: 'monthly', priceString: '$7.99', price: 7.99, currencyCode: 'USD', trialDays: DEFAULT_TRIAL_DAYS },
];

const UNIT_DAYS: Record<string, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };

export function periodDays(unit: string, count: number): number | null {
  const days = UNIT_DAYS[unit];
  return days && count > 0 ? days * count : null;
}

export const PACKAGE_TYPE: Record<PlanId, string> = {
  annual: 'ANNUAL',
  monthly: 'MONTHLY',
};

export interface PurchaseResult {
  pro: boolean;
  cancelled: boolean;
  error: string | null;
}

export function formatMoney(amount: number, currencyCode: string): string | null {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(amount);
  } catch {
    return null;
  }
}

export function perMonthLabel(plan: PlanOption): string | null {
  if (plan.id !== 'annual') return null;
  const formatted = formatMoney(plan.price / 12, plan.currencyCode);
  return formatted ? `${formatted} / month` : null;
}
