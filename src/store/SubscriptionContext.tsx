import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PLANS } from '../services/purchaseCommon';
import {
  addProListener,
  configurePurchases,
  fetchIsPro,
  fetchPlans,
  purchasePlan,
  restorePurchases,
} from '../services/purchases';
import { loadJson, saveJson, STORAGE_KEYS } from '../services/storage';
import type { PlanId, PlanOption } from '../types';

interface SubscriptionValue {
  ready: boolean;
  subscribed: boolean;
  plans: PlanOption[];
  paywallVisible: boolean;
  purchasing: boolean;
  message: string | null;
  subscribe: (plan: PlanId) => Promise<void>;
  restore: () => Promise<void>;
  openPaywall: () => void;
  dismissPaywall: () => void;
  clearMessage: () => void;
}

const SubscriptionContext = createContext<SubscriptionValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [plans, setPlans] = useState<PlanOption[]>(DEFAULT_PLANS);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const apply = useCallback((pro: boolean) => {
    setSubscribed(pro);
    void saveJson(STORAGE_KEYS.entitlement, { pro });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const cached = await loadJson<{ pro: boolean }>(STORAGE_KEYS.entitlement);
      if (cancelled) return;
      if (cached?.pro) setSubscribed(true);
      setReady(true);
      const ok = await configurePurchases();
      if (cancelled || !ok) return;
      const [pro, planResult] = await Promise.all([fetchIsPro(), fetchPlans()]);
      if (cancelled) return;
      if (pro || !cached?.pro) apply(pro);
      setPlans(planResult.plans);
      unsubscribe = addProListener(apply);
    })();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [apply]);

  const subscribe = useCallback(
    async (plan: PlanId) => {
      setMessage(null);
      setPurchasing(true);
      try {
        const result = await purchasePlan(plan);
        if (result.pro) {
          apply(true);
          setPaywallVisible(false);
        } else if (result.error) {
          setMessage(result.error);
        }
      } finally {
        setPurchasing(false);
      }
    },
    [apply],
  );

  const restore = useCallback(async () => {
    setMessage(null);
    setPurchasing(true);
    try {
      const result = await restorePurchases();
      if (result.pro) {
        apply(true);
        setPaywallVisible(false);
        setMessage('Purchases restored.');
      } else {
        setMessage(result.error ?? 'No active subscription found.');
      }
    } finally {
      setPurchasing(false);
    }
  }, [apply]);

  const openPaywall = useCallback(() => {
    setMessage(null);
    setPaywallVisible(true);
  }, []);
  const dismissPaywall = useCallback(() => setPaywallVisible(false), []);
  const clearMessage = useCallback(() => setMessage(null), []);

  const value = useMemo(
    () => ({
      ready,
      subscribed,
      plans,
      paywallVisible,
      purchasing,
      message,
      subscribe,
      restore,
      openPaywall,
      dismissPaywall,
      clearMessage,
    }),
    [ready, subscribed, plans, paywallVisible, purchasing, message, subscribe, restore, openPaywall, dismissPaywall, clearMessage],
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription(): SubscriptionValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription outside SubscriptionProvider');
  return ctx;
}
