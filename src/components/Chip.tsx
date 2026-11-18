import { Pressable, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme';
import { Txt } from './Txt';

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected ? styles.on : styles.off, pressed && styles.pressed]}
    >
      <Txt variant="label" color={selected ? 'onPrimary' : 'ink'}>
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radii.chip,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderBottomWidth: 3,
  },
  on: { backgroundColor: colors.primary, borderColor: colors.primary, borderBottomColor: colors.primaryEdge },
  off: { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: colors.edge },
  pressed: { borderBottomWidth: 1.5, marginTop: 1.5 },
});
