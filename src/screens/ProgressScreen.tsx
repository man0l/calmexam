import { StyleSheet, View } from 'react-native';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenShell } from '../components/ScreenShell';
import { Txt } from '../components/Txt';
import { WeekStrip } from '../components/WeekStrip';
import { topicsFor } from '../engine';
import { accuracy } from '../services/practice';
import { useProfile } from '../store/ProfileContext';
import { useProgress } from '../store/ProgressContext';
import { spacing } from '../theme';

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Card style={styles.stat}>
      <Txt variant="h2" style={styles.num}>
        {value}
      </Txt>
      <Txt variant="caption" color="inkMuted">
        {label}
      </Txt>
    </Card>
  );
}

export function ProgressScreen() {
  const { profile, exam } = useProfile();
  const { progress, totalSolved, totalCorrect, streak, best } = useProgress();
  const topics = topicsFor(profile.exam);
  const overall = totalSolved ? Math.round((totalCorrect / totalSolved) * 100) : null;

  return (
    <ScreenShell edges={['top']}>
      <View style={styles.head}>
        <Txt variant="caption" color="inkMuted">
          {exam.name.toUpperCase()}
        </Txt>
        <Txt variant="title">Progress</Txt>
      </View>
      <View style={styles.stats}>
        <Stat value={String(totalSolved)} label="solved" />
        <Stat value={overall === null ? '–' : `${overall}%`} label="accuracy" />
      </View>
      <View style={styles.stats}>
        <Stat value={String(streak)} label="current streak" />
        <Stat value={String(best)} label="best streak" />
      </View>
      <Card style={styles.section}>
        <Txt variant="h3">This week</Txt>
        <WeekStrip days={progress.days} />
      </Card>
      <Card style={styles.section}>
        <Txt variant="h3">Accuracy by topic</Txt>
        {topics.map((t) => {
          const stat = progress.topics[t.id];
          const acc = accuracy(stat);
          return (
            <View key={t.id} style={styles.topic}>
              <View style={styles.topicHead}>
                <Txt variant="label" style={styles.flex}>
                  {t.name}
                </Txt>
                <Txt variant="caption" color="inkMuted" style={styles.num}>
                  {acc === null ? 'Not started' : `${Math.round(acc * 100)}% · ${stat.correct}/${stat.attempts}`}
                </Txt>
              </View>
              <ProgressBar value={acc ?? 0} color={acc !== null && acc >= 0.8 ? 'correct' : 'primary'} />
            </View>
          );
        })}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { gap: spacing.xs, marginBottom: spacing.xl },
  stats: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  stat: { flex: 1, gap: 2, padding: spacing.lg },
  num: { fontVariant: ['tabular-nums'] },
  section: { marginTop: spacing.sm, marginBottom: spacing.md, gap: spacing.lg },
  topic: { gap: spacing.sm },
  topicHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
