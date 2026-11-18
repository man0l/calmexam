import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { GoalRing } from '../components/GoalRing';
import { Icon } from '../components/Icon';
import { ScreenShell } from '../components/ScreenShell';
import { Txt } from '../components/Txt';
import { WeekStrip } from '../components/WeekStrip';
import { formatScore } from '../engine';
import { useWeakTopics } from '../hooks/useWeakTopics';
import { daysUntil, formatLong, todayKey } from '../services/dates';
import { randomSeed } from '../services/practice';
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

  return (
    <ScreenShell edges={['top']}>
      <View style={styles.head}>
        <Txt variant="caption" color="inkMuted">
          {formatLong(todayKey()).toUpperCase()}
        </Txt>
        <Txt variant="title">Today</Txt>
      </View>

      <Card variant="soft" style={styles.countdown}>
        <View style={styles.flex}>
          <Txt variant="display" color="primary">
            {String(days)}
          </Txt>
          <Txt variant="bodyStrong">{`days until ${exam.name}`}</Txt>
          <Txt variant="small" color="inkMuted">
            {formatLong(profile.examDate)}
          </Txt>
        </View>
        <Icon name="calendar" color="primary" size={32} />
      </Card>

      <Card style={styles.goalCard}>
        <View style={styles.goalRow}>
          <GoalRing done={todayCount} goal={goal} />
          <View style={styles.goalText}>
            <Txt variant="h3">{goalMet ? 'Daily goal met' : 'Daily goal'}</Txt>
            <Txt variant="small" color="inkMuted">
              {goalMet
                ? 'Nicely done. Anything more today is a bonus.'
                : `${goal - todayCount} more to reach today's ${goal}. About ${profile.minutesPerDay} minutes.`}
            </Txt>
            <Txt variant="label" color="primary">
              {streak === 1 ? '1-day streak' : `${streak}-day streak`}
            </Txt>
          </View>
        </View>
        <WeekStrip days={progress.days} />
      </Card>

      <Button
        testID="start-today"
        label={todayCount === 0 ? 'Start today’s session' : goalMet ? 'Start a bonus session' : 'Keep going today'}
        onPress={() => navigation.navigate('Session', { kind: 'today', seed: randomSeed() })}
      />
      <Txt variant="caption" color="inkFaint" align="center" style={styles.hint}>
        10 problems, weighted to your weakest topics
      </Txt>

      <Card>
        <View style={styles.planHead}>
          <Txt variant="h3">{`Your ${plan.daysLeft}-day plan`}</Txt>
          <Txt variant="label" color="inkMuted">
            {`Goal ${formatScore(exam.id, plan.projected.target)}`}
          </Txt>
        </View>
        <Txt variant="small" color="inkMuted">
          {`${profile.minutesPerDay} min a day · ${goal} problems · focus topics:`}
        </Txt>
        {weak.map((t, i) => {
          const locked = !subscribed && i > 0;
          return (
            <Pressable
              key={t.id}
              accessibilityRole="button"
              onPress={() =>
                locked ? openPaywall() : navigation.navigate('Session', { kind: 'topic', topicId: t.id, seed: randomSeed() })
              }
              style={({ pressed }) => [styles.topic, pressed && { backgroundColor: colors.inset }]}
            >
              <Txt variant="bodyStrong" color={locked ? 'inkFaint' : 'ink'} style={styles.flex}>
                {t.name}
              </Txt>
              <Icon name={locked ? 'lock' : 'chevron'} color={locked ? 'inkFaint' : 'primary'} size={20} />
            </Pressable>
          );
        })}
        {!subscribed ? (
          <Button label="Unlock the full plan" variant="secondary" onPress={openPaywall} />
        ) : null}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { gap: spacing.xs, marginBottom: spacing.lg },
  countdown: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  goalCard: { marginBottom: spacing.xl, gap: spacing.xl },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  goalText: { flex: 1, gap: spacing.xs },
  hint: { marginTop: spacing.sm, marginBottom: spacing.xxl },
  planHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topic: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.input,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
