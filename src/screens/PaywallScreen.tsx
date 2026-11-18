import { useEffect, useState } from 'react';
import { BackHandler, Linking, Pressable, StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { HeroCard } from '../components/HeroCard';
import { Icon, type IconName } from '../components/Icon';
import { ScreenShell } from '../components/ScreenShell';
import { TopBar } from '../components/TopBar';
import { Txt } from '../components/Txt';
import { formatScore } from '../engine';
import { formatShort } from '../services/dates';
import { PRIVACY_URL, TERMS_URL } from '../services/legal';
import { perMonthLabel, TRIAL_DAYS } from '../services/purchaseCommon';
import { useProfile } from '../store/ProfileContext';
import { FREE_EXPLANATIONS_PER_DAY } from '../store/ProgressContext';
import { useSubscription } from '../store/SubscriptionContext';
import { colors, layout, radii, spacing } from '../theme';
import type { PlanId, PlanOption } from '../types';

const TIMELINE: { icon: IconName; title: string; body: string }[] = [
  { icon: 'spark', title: 'Today', body: 'Your full plan and unlimited explanations unlock.' },
  { icon: 'bell', title: 'Day 5', body: 'We remind you before your trial ends.' },
  { icon: 'card', title: 'Day 7', body: 'Your plan starts. Cancel any time before.' },
];

function PlanRow({ plan, selected, onPress }: { plan: PlanOption; selected: boolean; onPress: () => void }) {
  const annual = plan.id === 'annual';
  const monthly = perMonthLabel(plan);
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
          <Txt variant="bodyStrong">{annual ? 'Annual' : 'Monthly'}</Txt>
          {annual ? (
            <View style={styles.badge}>
              <Txt variant="captionStrong" color="amberText">
                Best value
              </Txt>
            </View>
          ) : null}
        </View>
        <Txt variant="small" color="inkMuted">
          {annual ? `${plan.priceString} a year${monthly ? ` · ${monthly}` : ''}` : `${plan.priceString} a month`}
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

  return (
    <ScreenShell
      header={
        <TopBar
          right={
            <Pressable testID="paywall-close" accessibilityRole="button" onPress={dismissPaywall} hitSlop={10} style={styles.notNow}>
              <Txt variant="label" color="inkMuted">
                Not now
              </Txt>
            </Pressable>
          }
        />
      }
      footer={
        <>
          <Button
            testID="paywall-subscribe"
            label={`Start ${TRIAL_DAYS}-day free trial`}
            onPress={() => subscribe(selected)}
            loading={purchasing}
          />
          <Txt variant="caption" color="inkMuted" align="center">
            {`${TRIAL_DAYS} days free, then ${current.priceString} a ${selected === 'annual' ? 'year' : 'month'}. Cancel anytime.`}
          </Txt>
          <View style={styles.links}>
            <Pressable onPress={restore} accessibilityRole="button" style={styles.link}>
              <Txt variant="caption" color="primary">
                Restore
              </Txt>
            </Pressable>
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
      <HeroCard style={styles.head} wave={false}>
        <Txt variant="title" color="onPrimary">{`Your plan to ${target} on ${exam.shortName} by ${formatShort(profile.examDate)}`}</Txt>
        <Txt variant="small" color="lagoonMuted">
          {`${plan.daysLeft} days, ${profile.minutesPerDay} minutes a day, focused on ${plan.weakTopics
            .map((t) => t.name.toLowerCase())
            .join(', ')}.`}
        </Txt>
      </HeroCard>

      <View style={styles.timeline}>
        {TIMELINE.map((t, i) => (
          <View key={t.title} style={styles.tlRow}>
            <View style={styles.tlRail}>
              <View style={styles.tlIcon}>
                <Icon name={t.icon} color="primary" size={layout.iconSmall} />
              </View>
              {i < TIMELINE.length - 1 ? <View style={styles.tlLine} /> : null}
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

      <View style={styles.plans}>
        {plans.map((p) => (
          <PlanRow key={p.id} plan={p} selected={p.id === selected} onPress={() => setSelected(p.id)} />
        ))}
      </View>
      <Txt variant="caption" color="inkMuted" align="center" style={styles.message}>
        {`Practice stays free and unlimited. Pro adds unlimited "Explain my mistake" (free: ${FREE_EXPLANATIONS_PER_DAY} a day) and your full plan.`}
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
  notNow: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.sm },
  head: { gap: spacing.sm, marginBottom: spacing.xxl },
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
  tlLine: { flex: 1, width: 2, backgroundColor: colors.primarySoft, minHeight: spacing.sm },
  tlText: { flex: 1, paddingBottom: spacing.md, gap: 0 },
  plans: { gap: spacing.md },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.option,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.border,
    borderBottomColor: colors.edge,
    backgroundColor: colors.surface,
  },
  planSelected: { borderColor: colors.primary, borderBottomColor: colors.primaryEdge, backgroundColor: colors.primarySoft },
  planTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
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
  links: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  link: { minHeight: 44, minWidth: 44, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center' },
  message: { marginTop: spacing.md },
});
