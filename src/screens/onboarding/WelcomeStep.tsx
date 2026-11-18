import { StyleSheet, View } from 'react-native';
import { BrandMark } from '../../components/BrandMark';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { ScreenShell } from '../../components/ScreenShell';
import { Txt } from '../../components/Txt';
import { spacing } from '../../theme';

const POINTS = [
  'Problems written the way your exam writes them',
  'Every answer checked by the generator, never guessed',
  'Short daily sessions that fit around school',
];

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <ScreenShell
      footer={<Button testID="welcome-start" label="Get started" onPress={onNext} />}
      contentStyle={styles.content}
    >
      <View style={styles.hero}>
        <BrandMark size={72} />
        <Txt variant="captionStrong" color="primary">
          CALMEXAM
        </Txt>
        <Txt variant="title" align="center">
          Unlimited exam practice. Every answer verified.
        </Txt>
        <Txt variant="body" color="inkMuted" align="center">
          The exam coach that is never wrong. SAT Math, AP Calculus AB and A-Level Maths.
        </Txt>
      </View>
      <Card>
        {POINTS.map((p) => (
          <View key={p} style={styles.point}>
            <Icon name="check" color="primary" />
            <Txt variant="body" style={styles.flex}>
              {p}
            </Txt>
          </View>
        ))}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.huge },
  hero: { alignItems: 'center', gap: spacing.md, marginBottom: spacing.xxxl },
  point: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  flex: { flex: 1 },
});
