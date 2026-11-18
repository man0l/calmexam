import { StyleSheet, View } from 'react-native';
import type { Problem } from '../engine';
import { colors, fonts, radii, spacing } from '../theme';
import { Card } from './Card';
import { Icon } from './Icon';
import { Txt } from './Txt';

export function SolutionCard({ problem }: { problem: Problem }) {
  return (
    <View style={styles.wrap}>
      <Card>
        <View style={styles.verified}>
          <Icon name="check" color="correct" size={18} />
          <Txt variant="captionStrong" color="correct">
            VERIFIED ANSWER
          </Txt>
        </View>
        <Txt variant="math" style={styles.answer}>
          {problem.answer}
        </Txt>
        {problem.steps.map((s, i) => (
          <View key={i} style={styles.step}>
            <View style={styles.num}>
              <Txt variant="captionStrong" color="primary">
                {String(i + 1)}
              </Txt>
            </View>
            <Txt variant="body" style={styles.flex}>
              {s}
            </Txt>
          </View>
        ))}
      </Card>
      {problem.pitfalls.length ? (
        <Card variant="inset">
          <Txt variant="captionStrong" color="inkMuted">
            COMMON PITFALLS
          </Txt>
          {problem.pitfalls.map((p, i) => (
            <View key={i} style={styles.step}>
              <Txt variant="body" color="inkMuted">
                {'•'}
              </Txt>
              <Txt variant="body" style={styles.flex}>
                {p}
              </Txt>
            </View>
          ))}
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  flex: { flex: 1 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  answer: { fontFamily: fonts.semibold },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  num: {
    width: 24,
    height: 24,
    marginTop: 1,
    borderRadius: radii.chip,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
