import { Pressable, StyleSheet } from 'react-native';
import { colors, layout, radii, spacing } from '../theme';
import { Txt } from './Txt';

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.on : styles.off]}
    >
      <Txt variant="label" color={selected ? 'primary' : 'ink'}>
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
    borderWidth: layout.hairline,
  },
  on: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  off: { backgroundColor: colors.surface, borderColor: colors.border },
});
