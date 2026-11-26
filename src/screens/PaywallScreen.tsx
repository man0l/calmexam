import { useEffect, useState } from 'react';
import { BackHandler, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { Icon, type IconName } from '../components/Icon';
import { ScreenShell } from '../components/ScreenShell';
import { TopBar } from '../components/TopBar';
import { Txt } from '../components/Txt';
import { formatScore } from '../engine';
import { addDays, formatShort, todayKey } from '../services/dates';
import { PRIVACY_URL, TERMS_URL } from '../services/legal';
import { perMonthLabel } from '../services/purchaseCommon';
import { useProfile } from '../store/ProfileContext';
import { FREE_EXPLANATIONS_PER_DAY } from '../store/ProgressContext';
import { useSubscription } from '../store/SubscriptionContext';
import { colors, layout, radii, spacing } from '../theme';
import type { PlanId, PlanOption } from '../types';

const STORE = Platform.select({ ios: 'App Store', android: 'Google Play', default: 'app store' });

function timeline(plan: PlanOption, trialDays: number): { icon: IconName; title: string; body: string }[] {
  const today = todayKey();
  const period = plan.id === 'annual' ? 'year' : 'month';
  return [
    { icon: 'lock', title: 'Today', body: 'Your full plan and unlimited explanations unlock. No payment now.' },
    {
      icon: 'calendar',
      title: formatShort(addDays(today, Math.max(trialDays - 2, 1))),
      body: `Still free. Cancel in ${STORE} subscriptions in a couple of taps.`,
    },
    {
      icon: 'card',
      title: formatShort(addDays(today, trialDays)),
      body: `You pay ${plan.priceString} a ${period}, unless you cancel before.`,
    },
  ];
}

function planCaption(plan: PlanOption): string {
  const monthly = perMonthLabel(plan);
  const trial = plan.trialDays ? `${plan.trialDays} days free` : null;
  if (monthly && trial) return `${monthly} · ${trial}`;
  return monthly ?? trial ?? 'Billed monthly';
}

function PlanRow({ plan, selected, onPress }: { plan: PlanOption; selected: boolean; onPress: () => void }) {
  const annual = plan.id === 'annual';
  return (
    <Pressable
      testID={`plan-${plan.id}`}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.plan, selected && styles.planSelected]}
    >
      <View style={[styles.radio, selected && styles.radioOn]}>{selected ? <View style={styles.radioDot} /> : null}</View>
      <View style={styles.flex}>
        <View style={styles.planTitle}>
          <Txt variant="bodyStrong">{annual ? 'Yearly' : 'Monthly'}</Txt>
          {annual ? (
            <View style={styles.badge}>
              <Txt variant="captionStrong" color="amberText">
                BEST VALUE
              </Txt>
            </View>
          ) : null}
        </View>
        <Txt variant="caption" color="inkMuted">
          {planCaption(plan)}
        </Txt>
      </View>
      <View style={styles.price}>
        <Txt variant="number">{plan.priceString}</Txt>
        <Txt variant="caption" color="inkMuted">
          {annual ? 'per year' : 'per month'}
        </Txt>
      </View>
    </Pressable>
  );
}

export function PaywallScreen() {
  const { profile, exam, plan } = useProfile();
  const { plans, subscribe, restore, dismissPaywall, purchasing, message } = useSubscription();
  const [selected, setSelected] = useState<PlanId>('annual');

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      dismissPaywall();
      return true;
    });
    return () => sub.remove();
  }, [dismissPaywall]);
  const current = plans.find((p) => p.id === selected) ?? plans[0];
  const target = formatScore(exam.id, plan.projected.target);
  const monthly = perMonthLabel(current);
  const trialDays = current.trialDays;
  const billing = `${current.priceString} a ${selected === 'annual' ? 'year' : 'month'}${
    selected === 'annual' && monthly ? ` (${monthly})` : ''
  }`;

  return (
    <ScreenShell
      header={
        <TopBar
          onBack={dismissPaywall}
          backIcon="close"
          right={
            <Pressable testID="paywall-restore" accessibilityRole="button" onPress={restore} hitSlop={10} style={styles.restore}>
              <Txt variant="label" color="inkMuted">
                Restore
              </Txt>
            </Pressable>
          }
        />
      }
      footer={
        <>
          {trialDays ? (
            <View style={styles.noPay}>
              <Icon name="check" color="primary" size={layout.iconSmall} />
              <Txt variant="label">No payment due now</Txt>
            </View>
          ) : null}
          <Button
            testID="paywall-subscribe"
            label={trialDays ? 'Start my free trial' : 'Subscribe'}
            onPress={() => subscribe(selected)}
            loading={purchasing}
          />
          <Txt variant="caption" color="inkMuted" align="center">
            {trialDays
              ? `${trialDays} days free, then ${billing}. Cancel anytime.`
              : `${billing}. Renews automatically. Cancel anytime.`}
          </Txt>
          <View style={styles.links}>
            <Pressable onPress={() => Linking.openURL(TERMS_URL)} accessibilityRole="link" style={styles.link}>
              <Txt variant="caption" color="primary">
                Terms
              </Txt>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(PRIVACY_URL)} accessibilityRole="link" style={styles.link}>
              <Txt variant="caption" color="primary">
                Privacy
              </Txt>
            </Pressable>
          </View>
        </>
      }
    >
      <View style={styles.head}>
        <Txt variant="title" align="center">
          {trialDays ? `Start your ${trialDays}-day free trial` : 'Unlock your full plan'}
        </Txt>
        <Txt variant="body" color="inkMuted" align="center">
          {`Your plan to ${target} on ${exam.shortName} by ${formatShort(profile.examDate)} is ready.`}
        </Txt>
      </View>

      {trialDays ? (
        <View style={styles.timeline}>
          {timeline(current, trialDays).map((t, i, all) => (
            <View key={t.icon} style={styles.tlRow}>
              <View style={styles.tlRail}>
                <View style={[styles.tlIcon, i === 0 && styles.tlIconOn]}>
                  <Icon name={t.icon} color={i === 0 ? 'onPrimary' : 'primary'} size={layout.iconSmall} />
                </View>
                {i < all.length - 1 ? <View style={styles.tlLine} /> : null}
              </View>
              <View style={styles.tlText}>
                <Txt variant="bodyStrong">{t.title}</Txt>
                <Txt variant="small" color="inkMuted">
                  {t.body}
                </Txt>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.plans}>
        {plans.map((p) => (
          <PlanRow key={p.id} plan={p} selected={p.id === selected} onPress={() => setSelected(p.id)} />
        ))}
      </View>
      <Txt variant="caption" color="inkMuted" align="center" style={styles.message}>
        {`Practice stays free and unlimited. Pro adds your full plan and unlimited "Explain my mistake" (free: ${FREE_EXPLANATIONS_PER_DAY} a day).`}
      </Txt>
      {message ? (
        <Txt variant="small" color="inkMuted" align="center" style={styles.message}>
          {message}
        </Txt>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  restore: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.sm },
  head: { gap: spacing.xs, marginBottom: spacing.lg, paddingHorizontal: spacing.sm },
  timeline: { marginBottom: spacing.sm },
  tlRow: { flexDirection: 'row', gap: spacing.md },
  tlRail: { alignItems: 'center', width: 36 },
  tlIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.chip,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlIconOn: { backgroundColor: colors.primary },
  tlLine: { flex: 1, width: 3, backgroundColor: colors.primarySoft, minHeight: spacing.sm },
  tlText: { flex: 1, paddingBottom: spacing.sm },
  plans: { gap: spacing.sm },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.option,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.border,
    borderBottomColor: colors.edge,
    backgroundColor: colors.surface,
  },
  planSelected: { borderColor: colors.primary, borderBottomColor: colors.primaryEdge, backgroundColor: colors.primarySoft },
  planTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  price: { alignItems: 'flex-end' },
  badge: { backgroundColor: colors.amberSoft, borderRadius: radii.chip, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radii.chip,
    borderWidth: 2,
    borderColor: colors.inkFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: radii.chip, backgroundColor: colors.primary },
  noPay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  links: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  link: { minHeight: 44, minWidth: 44, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center' },
  message: { marginTop: spacing.md },
});
