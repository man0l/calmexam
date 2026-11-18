import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { GoalRing } from '../components/GoalRing';
import { HeroCard } from '../components/HeroCard';
import { Icon } from '../components/Icon';
import { ScreenShell } from '../components/ScreenShell';
import { StonePath, type Stone } from '../components/StonePath';
import { Txt } from '../components/Txt';
import { WeekStrip } from '../components/WeekStrip';
import { formatScore } from '../engine';
import { useWeakTopics } from '../hooks/useWeakTopics';
import { daysUntil, formatLong, formatShort, todayKey } from '../services/dates';
import { accuracy, randomSeed } from '../services/practice';
import { useProfile } from '../store/ProfileContext';
import { useProgress } from '../store/ProgressContext';
import { useSubscription } from '../store/SubscriptionContext';
import { colors, radii, spacing } from '../theme';

export function TodayScreen() {
  const navigation = useNavigation();
  const { profile, exam, plan } = useProfile();
  const { todayCount, streak, progress } = useProgress();
  const { subscribed, openPaywall } = useSubscription();
  const weak = useWeakTopics();
  const days = daysUntil(profile.examDate);
  const goal = plan.problemsPerDay;
  const goalMet = todayCount >= goal;
  const left = Math.max(0, goal - todayCount);

  const base = weak.map((t, i): Stone['state'] => {
    const acc = accuracy(progress.topics[t.id]);
    const mastered = acc !== null && acc >= 0.8 && (progress.topics[t.id]?.attempts ?? 0) >= 5;
    return !subscribed && i > 0 ? 'locked' : mastered ? 'done' : 'open';
  });
  const current = base.indexOf('open');
  const stones: Stone[] = weak.map((t, i) => {
    const locked = base[i] === 'locked';
    const acc = accuracy(progress.topics[t.id]);
    const state: Stone['state'] = i === current ? 'current' : base[i];
    return {
      id: t.id,
      topicId: t.id,
      title: t.name,
      caption: locked ? 'Unlock with Pro' : acc === null ? 'New topic' : `${Math.round(acc * 100)}% correct`,
      state,
      onPress: () =>
        locked ? openPaywall() : navigation.navigate('Session', { kind: 'topic', topicId: t.id, seed: randomSeed() }),
    };
  });

  return (
    <ScreenShell edges={['top']}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <Txt variant="captionStrong" color="inkMuted">
            {formatLong(todayKey()).toUpperCase()}
          </Txt>
          <Txt variant="title">Today</Txt>
        </View>
        <View style={styles.streak} accessibilityLabel={`${streak}-day streak`}>
          <Icon name="stones" color="primary" size={20} />
          <Txt variant="number">{String(streak)}</Txt>
        </View>
      </View>

      <HeroCard style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Txt variant="h2" color="onPrimary">
              {goalMet ? 'Goal met. Anything more is a bonus' : todayCount === 0 ? `${goal} problems, ${profile.minutesPerDay} min` : `${left} to go today`}
            </Txt>
            <Txt variant="small" color="lagoonMuted">
              {`Weighted to ${weak
                .slice(0, 2)
                .map((t) => t.name.toLowerCase())
                .join(' and ')}`}
            </Txt>
          </View>
          <GoalRing done={todayCount} goal={goal} size={96} onDark />
        </View>
        <Button
          testID="start-today"
          variant="light"
          label={todayCount === 0 ? 'Start today’s session' : goalMet ? 'Start a bonus session' : 'Keep going'}
          onPress={() => navigation.navigate('Session', { kind: 'today', seed: randomSeed() })}
        />
        <View style={styles.heroFoot}>
          <Icon name="calendar" color="mint" size={18} />
          <Txt variant="small" color="lagoonMuted">
            {`${days} days to ${exam.shortName} · ${formatShort(profile.examDate)}`}
          </Txt>
        </View>
      </HeroCard>

      <View style={styles.pathHead}>
        <Txt variant="h2">{`Your path to ${formatScore(exam.id, plan.projected.target)}`}</Txt>
        <Txt variant="small" color="inkMuted">
          {`${plan.daysLeft}-day plan · your weakest topics come first`}
        </Txt>
      </View>
      <StonePath stones={stones} finish={{ title: 'Exam day', caption: formatLong(profile.examDate) }} />
      {!subscribed ? (
        <View style={styles.unlock}>
          <Button label="Unlock the full plan" variant="secondary" onPress={openPaywall} />
        </View>
      ) : null}
      <Card style={styles.week}>
        <View style={styles.weekHead}>
          <Txt variant="h3">This week</Txt>
          <Txt variant="label" color="primary">
            {streak === 1 ? '1 day in a row' : `${streak} days in a row`}
          </Txt>
        </View>
        <WeekStrip days={progress.days} />
      </Card>

    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md, marginBottom: spacing.xl },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radii.chip,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderBottomWidth: 3,
    borderBottomColor: colors.edge,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  hero: { marginBottom: spacing.xxl, gap: spacing.lg },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  heroText: { flex: 1, gap: spacing.xs },
  heroFoot: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, justifyContent: 'center' },
  week: { marginTop: spacing.xxxl, gap: spacing.lg },
  weekHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pathHead: { gap: spacing.xs, marginBottom: spacing.xl },
  unlock: { marginTop: spacing.xxl },
});
