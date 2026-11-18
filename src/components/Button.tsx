import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { colors, layout, radii, spacing, type ColorToken } from '../theme';
import { tapHaptic } from '../services/haptics';
import { Txt } from './Txt';

type Variant = 'primary' | 'secondary' | 'ghost' | 'premium';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
  testID?: string;
}

const TEXT: Record<Variant, ColorToken> = {
  primary: 'onPrimary',
  secondary: 'primary',
  ghost: 'primary',
  premium: 'onPrimary',
};

export function Button({ label, onPress, variant = 'primary', disabled, loading, compact, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled || loading}
      onPress={() => {
        tapHaptic();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variant === 'primary' && { backgroundColor: pressed ? colors.primaryPressed : colors.primary },
        variant === 'premium' && { backgroundColor: pressed ? colors.primaryPressed : colors.primary },
        variant === 'secondary' && [styles.secondary, pressed && { backgroundColor: colors.primarySoft }],
        variant === 'ghost' && pressed && { backgroundColor: colors.primarySoft },
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={colors[TEXT[variant]]} /> : null}
        <Txt variant="button" color={TEXT[variant]}>
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.buttonHeight,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
  compact: { minHeight: 44, width: 'auto' },
  secondary: { borderWidth: layout.hairline, borderColor: colors.primary, backgroundColor: colors.surface },
  disabled: { opacity: 0.4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
