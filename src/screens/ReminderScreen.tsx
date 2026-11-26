import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { ScreenShell } from '../components/ScreenShell';
import { TopBar } from '../components/TopBar';
import { Txt } from '../components/Txt';
import type { RootStackParamList } from '../navigation/types';
import { enableReminder } from '../services/reminders';
import { spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Reminder'>;

const POINTS = [
  'One notification at 9 pm that opens a single problem.',
  'No streak warnings, no badges, no countdowns.',
  'Turn it off anytime in Settings.',
];

export function ReminderScreen({ navigation }: Props) {
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);

  const onContinue = async () => {
    setBusy(true);
    const res = await enableReminder();
    setBusy(false);
    if (res === 'enabled') navigation.goBack();
    else setDenied(true);
  };

  return (
    <ScreenShell
      header={<TopBar onBack={() => navigation.goBack()} backIcon="close" />}
      footer={
        denied ? (
          <>
            <Button label="Open settings" onPress={() => Linking.openSettings()} />
            <Button label="Not now" variant="ghost" onPress={() => navigation.goBack()} />
          </>
        ) : (
          <>
            <Button testID="reminder-continue" label="Continue" onPress={onContinue} loading={busy} />
            <Button label="Not now" variant="ghost" onPress={() => navigation.goBack()} />
          </>
        )
      }
    >
      <View style={styles.head}>
        <Icon name="bell" color="primary" size={32} />
        <Txt variant="title">A quiet nudge each evening</Txt>
        <Txt variant="body" color="inkMuted">
          The nights you feel behind are the nights one problem helps most.
        </Txt>
      </View>
      <Card style={styles.card}>
        {POINTS.map((p) => (
          <View key={p} style={styles.point}>
            <Icon name="check" color="correct" size={18} />
            <Txt variant="body" style={styles.flex}>
              {p}
            </Txt>
          </View>
        ))}
      </Card>
      {denied ? (
        <Txt variant="small" color="inkMuted" style={styles.note}>
          Notifications are off for CalmExam on this device. You can turn them on in your phone’s settings.
        </Txt>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { gap: spacing.sm, marginBottom: spacing.xl },
  card: { gap: spacing.md },
  point: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  note: { marginTop: spacing.lg },
});
