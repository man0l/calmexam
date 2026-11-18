import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenShell } from '../components/ScreenShell';
import { Txt } from '../components/Txt';
import { topicsFor } from '../engine';
import { accuracy, randomSeed } from '../services/practice';
import { useProfile } from '../store/ProfileContext';
import { useProgress } from '../store/ProgressContext';
import { colors, layout, radii, spacing } from '../theme';

export function PracticeScreen() {
  const navigation = useNavigation();
  const { profile, exam } = useProfile();
  const { progress } = useProgress();
  const topics = topicsFor(profile.exam);

  return (
    <ScreenShell edges={['top']}>
      <View style={styles.head}>
        <Txt variant="caption" color="inkMuted">
          {exam.name.toUpperCase()}
        </Txt>
        <Txt variant="title">Practice</Txt>
        <Txt variant="small" color="inkMuted">
          Unlimited, always free. Pick a topic and go at your own pace.
        </Txt>
      </View>
      <View style={styles.list}>
        {topics.map((t) => {
          const stat = progress.topics[t.id];
          const acc = accuracy(stat);
          return (
            <Pressable
              key={t.id}
              testID={`topic-${t.id}`}
              accessibilityRole="button"
              onPress={() => navigation.navigate('Session', { kind: 'topic', topicId: t.id, seed: randomSeed() })}
              style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.inset }]}
            >
              <View style={styles.flex}>
                <Txt variant="bodyStrong">{t.name}</Txt>
                <Txt variant="small" color="inkMuted" numberOfLines={2}>
                  {t.blurb}
                </Txt>
                <View style={styles.meter}>
                  <View style={styles.flex}>
                    <ProgressBar value={acc ?? 0} color={acc !== null && acc >= 0.8 ? 'correct' : 'primary'} height={6} />
                  </View>
                  <Txt variant="caption" color="inkMuted" style={styles.pct}>
                    {acc === null ? 'New' : `${Math.round(acc * 100)}%`}
                  </Txt>
                </View>
              </View>
              <Icon name="chevron" color="primary" size={20} />
            </Pressable>
          );
        })}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { gap: spacing.xs, marginBottom: spacing.xl },
  list: { gap: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.card,
    borderWidth: layout.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  meter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  pct: { minWidth: 36, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
