import { StyleSheet, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { ScreenShell } from '../../components/ScreenShell';
import { Txt } from '../../components/Txt';
import { colors, radii, spacing } from '../../theme';

const POINTS = [
  'Questions written the way your exam writes them',
  'Every answer checked by the generator, never guessed',
  'Practice stays free and unlimited',
];

function Stones() {
  return (
    <Svg width={132} height={84} viewBox="0 0 220 120">
      <Path d="M8 100c18-8 36-8 54 0s36 8 54 0 36-8 54 0 26 6 42 2" stroke={colors.primary} strokeWidth={4} strokeLinecap="round" fill="none" />
      <Ellipse cx={44} cy={89} rx={24} ry={11} fill={colors.sandEdge} />
      <Ellipse cx={44} cy={85} rx={24} ry={11} fill={colors.sand} />
      <Ellipse cx={104} cy={66} rx={28} ry={13} fill={colors.primary} />
      <Ellipse cx={104} cy={61} rx={28} ry={13} fill={colors.mint} />
      <Ellipse cx={170} cy={38} rx={32} ry={15} fill={colors.lagoonMuted} />
      <Ellipse cx={170} cy={32} rx={32} ry={15} fill={colors.surface} />
      <Path d="M160 32l7 7 13-13" stroke={colors.lagoon} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <ScreenShell footer={<Button testID="welcome-start" label="Get started" onPress={onNext} />} contentStyle={styles.content}>
      <View style={styles.stack}>
        <View style={styles.center}>
          <View style={styles.art}>
            <Stones />
          </View>
          <Txt variant="title" align="center">
            Reach your target score, one calm step at a time
          </Txt>
          <Txt variant="body" color="inkMuted" align="center">
            Pick your exam, answer 5 quick questions, get your personal plan.
          </Txt>
        </View>
        <View style={styles.proof}>
          {POINTS.map((p) => (
            <View key={p} style={styles.point}>
              <Icon name="check" color="primary" size={18} />
              <Txt variant="small" style={styles.flex}>
                {p}
              </Txt>
            </View>
          ))}
        </View>
        <Txt variant="caption" color="inkMuted" align="center">
          SAT Math · AP Calculus AB · A-Level Maths
        </Txt>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center' },
  stack: { gap: spacing.xxl },
  center: { alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.sm },
  art: {
    width: 168,
    height: 168,
    borderRadius: radii.chip,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  proof: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    backgroundColor: colors.surface,
  },
  point: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  flex: { flex: 1 },
});
