import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { Explanation } from '../services/api';
import { colors, radii, spacing } from '../theme';
import { BrandMark } from './BrandMark';
import { Txt } from './Txt';

interface Props {
  loading: boolean;
  explanation: Explanation | null;
}

export function ExplainCard({ loading, explanation }: Props) {
  return (
    <View style={styles.row} testID="explain-card">
      <BrandMark size={32} />
      <View style={styles.bubble}>
        <Txt variant="captionStrong" color="primary">
          COACH
        </Txt>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
            <Txt variant="small" color="inkMuted">
              Looking at your answer...
            </Txt>
          </View>
        ) : explanation ? (
          <>
            <Txt variant="body">{explanation.text}</Txt>
            {explanation.source === 'local' ? (
              <Txt variant="caption" color="inkFaint">
                Offline explanation, built from the verified steps.
              </Txt>
            ) : null}
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  bubble: {
    flex: 1,
    backgroundColor: colors.primarySoft,
    borderRadius: radii.card,
    borderTopLeftRadius: spacing.xs,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  loading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
