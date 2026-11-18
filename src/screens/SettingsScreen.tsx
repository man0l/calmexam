import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import type { ReactNode } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { ScreenShell } from '../components/ScreenShell';
import { Txt } from '../components/Txt';
import { confirmAction } from '../services/confirm';
import { daysUntil, formatLong } from '../services/dates';
import { PRIVACY_URL, TERMS_URL } from '../services/legal';
import { presentCustomerCenter } from '../services/purchases';
import { useProfile } from '../store/ProfileContext';
import { useProgress } from '../store/ProgressContext';
import { useSubscription } from '../store/SubscriptionContext';
import { colors, spacing, type ColorToken } from '../theme';

function Row({
  label,
  value,
  onPress,
  color = 'ink',
  last,
}: {
  label: string;
  value?: string;
  onPress: () => void;
  color?: ColorToken;
  last?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, !last && styles.rowBorder, pressed && { backgroundColor: colors.inset }]}
    >
      <Txt variant="body" color={color} style={styles.flex}>
        {label}
      </Txt>
      {value ? (
        <Txt variant="small" color="inkMuted">
          {value}
        </Txt>
      ) : null}
      <Icon name="chevron" color="inkFaint" size={18} />
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Txt variant="captionStrong" color="inkMuted" style={styles.sectionTitle}>
        {title}
      </Txt>
      <Card style={styles.group}>{children}</Card>
    </View>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation();
  const { profile, exam } = useProfile();
  const { reset } = useProgress();
  const { subscribed, openPaywall, restore, message, purchasing } = useSubscription();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const onReset = async () => {
    const ok = await confirmAction(
      'Reset progress?',
      'This clears your solved problems, topic accuracy and streak on this device. Your exam settings stay.',
      'Reset',
    );
    if (ok) reset();
  };

  return (
    <ScreenShell edges={['top']}>
      <Txt variant="title" style={styles.title}>
        Settings
      </Txt>

      <Section title="YOUR EXAM">
        <Row
          label="Exam"
          value={profile.otherExam ? `${exam.shortName} (for ${profile.otherExam})` : exam.name}
          onPress={() => navigation.navigate('EditPlan', { field: 'exam' })}
        />
        <Row
          label="Exam date"
          value={`${formatLong(profile.examDate)} · ${daysUntil(profile.examDate)}d`}
          onPress={() => navigation.navigate('EditPlan', { field: 'date' })}
        />
        <Row
          label="Daily time"
          value={`${profile.minutesPerDay} min`}
          onPress={() => navigation.navigate('EditPlan', { field: 'minutes' })}
          last
        />
      </Section>

      <Section title="CALMEXAM PRO">
        <View style={styles.pro}>
          <Txt variant="bodyStrong">{subscribed ? 'Pro is active' : 'Free plan'}</Txt>
          <Txt variant="small" color="inkMuted">
            {subscribed
              ? 'Unlimited explanations and your full plan are unlocked.'
              : 'Unlimited practice. 3 explanations a day. Upgrade for the full plan.'}
          </Txt>
          {subscribed ? (
            <Button label="Manage subscription" variant="secondary" onPress={presentCustomerCenter} />
          ) : (
            <Button testID="settings-upgrade" label="See Pro plans" onPress={openPaywall} />
          )}
          <Button label="Restore purchases" variant="ghost" onPress={restore} loading={purchasing} />
          {message ? (
            <Txt variant="caption" color="inkMuted" align="center">
              {message}
            </Txt>
          ) : null}
        </View>
      </Section>

      <Section title="ABOUT">
        <Row label="Privacy policy" onPress={() => Linking.openURL(PRIVACY_URL)} />
        <Row label="Terms of use" onPress={() => Linking.openURL(TERMS_URL)} />
        <Row label="Reset progress" color="wrong" onPress={onReset} last />
      </Section>

      <Txt variant="caption" color="inkFaint" align="center" style={styles.version}>
        {`CalmExam ${version}`}
      </Txt>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { marginBottom: spacing.xl },
  section: { marginBottom: spacing.xxl, gap: spacing.sm },
  sectionTitle: { paddingHorizontal: spacing.xs },
  group: { padding: 0, gap: 0, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg, paddingHorizontal: spacing.lg },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  pro: { padding: spacing.lg, gap: spacing.sm },
  version: { marginTop: spacing.sm },
});
