import { StyleSheet, View } from 'react-native';
import { colors, layout, radii, type ColorToken } from '../theme';

interface Props {
  value: number;
  color?: ColorToken;
  height?: number;
}

export function ProgressBar({ value, color = 'primary', height = layout.barHeight }: Props) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { height }]}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: colors[color] }]} />
    </View>
  );
}

export function SegmentedProgress({ total, done }: { total: number; done: number }) {
  return (
    <View style={styles.segments} accessibilityLabel={`${done} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.segment, { backgroundColor: i < done ? colors.primary : colors.inset }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', backgroundColor: colors.inset, borderRadius: radii.bar, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.bar },
  segments: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: layout.progressHeight + 2, borderRadius: radii.bar },
});
