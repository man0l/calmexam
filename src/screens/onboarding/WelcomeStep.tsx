import { StyleSheet, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';
import { Button } from '../../components/Button';
import { HeroCard } from '../../components/HeroCard';
import { Icon } from '../../components/Icon';
import { ScreenShell } from '../../components/ScreenShell';
import { Txt } from '../../components/Txt';
import { colors, spacing } from '../../theme';

const POINTS = [
  'Problems written the way your exam writes them',
  'Every answer checked by the generator, never guessed',
  'Short daily sessions that fit around school',
];

function Stones() {
  return (
    <Svg width={220} height={120} viewBox="0 0 220 120">
      <Path d="M8 100c18-8 36-8 54 0s36 8 54 0 36-8 54 0 26 6 42 2" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Path d="M30 112c14-5 28-5 42 0s28 5 42 0" stroke={colors.primary} strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" fill="none" />
      <Ellipse cx={44} cy={89} rx={24} ry={11} fill={colors.sandEdge} />
      <Ellipse cx={44} cy={85} rx={24} ry={11} fill={colors.sand} />
      <Ellipse cx={104} cy={66} rx={28} ry={13} fill={colors.primary} />
      <Ellipse cx={104} cy={61} rx={28} ry={13} fill={colors.mint} />
      <Ellipse cx={170} cy={38} rx={32} ry={15} fill={colors.lagoonMuted} />
      <Ellipse cx={170} cy={32} rx={32} ry={15} fill={colors.surface} />
      <Path d="M160 32l7 7 13-13" stroke={colors.lagoon} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <ScreenShell footer={<Button testID="welcome-start" label="Get started" onPress={onNext} />} contentStyle={styles.content}>
      <HeroCard style={styles.hero} wave={false}>
        <Txt variant="captionStrong" color="mint" align="center">
          CALMEXAM
        </Txt>
        <View style={styles.art}>
          <Stones />
        </View>
        <Txt variant="title" color="onPrimary" align="center">
          One calm step at a time to exam day
        </Txt>
        <Txt variant="body" color="lagoonMuted" align="center">
          Unlimited practice for SAT Math, AP Calculus AB and A-Level Maths. Every answer verified.
        </Txt>
      </HeroCard>
      <View style={styles.points}>
        {POINTS.map((p) => (
          <View key={p} style={styles.point}>
            <View style={styles.tick}>
              <Icon name="check" color="primary" size={16} />
            </View>
            <Txt variant="body" style={styles.flex}>
              {p}
            </Txt>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.lg },
  hero: { alignItems: 'stretch', paddingVertical: spacing.xxxl, marginBottom: spacing.xxl },
  art: { alignItems: 'center', marginVertical: spacing.sm },
  points: { gap: spacing.lg, paddingHorizontal: spacing.xs },
  point: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  tick: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
});
