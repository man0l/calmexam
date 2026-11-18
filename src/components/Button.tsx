import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { colors, layout, radii, spacing, type ColorToken } from '../theme';
import { tapHaptic } from '../services/haptics';
import { Txt } from './Txt';

type Variant = 'primary' | 'secondary' | 'ghost' | 'premium' | 'light';

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
  light: 'lagoon',
};

const FILL: Record<Variant, { idle: string; pressed: string; edge: string; border?: string }> = {
  primary: { idle: colors.primary, pressed: colors.primaryPressed, edge: colors.primaryEdge },
  premium: { idle: colors.amber, pressed: colors.amberEdge, edge: colors.amberEdge },
  secondary: { idle: colors.surface, pressed: colors.primarySoft, edge: colors.edge, border: colors.border },
  light: { idle: colors.surface, pressed: colors.primarySoft, edge: colors.mint },
  ghost: { idle: 'transparent', pressed: colors.primarySoft, edge: 'transparent' },
};

export function Button({ label, onPress, variant = 'primary', disabled, loading, compact, testID }: Props) {
  const fill = FILL[variant];
  const tactile = variant !== 'ghost';
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
      style={[styles.wrap, compact && styles.compactWrap, disabled && styles.disabled]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            compact && styles.compact,
            {
              backgroundColor: pressed ? fill.pressed : fill.idle,
              borderBottomColor: fill.edge,
              borderBottomWidth: tactile && !pressed ? layout.edge : 0,
              marginTop: tactile && pressed ? layout.edge : 0,
            },
            fill.border ? { borderWidth: 1.5, borderColor: fill.border, borderBottomColor: fill.edge } : null,
          ]}
        >
          {loading ? <ActivityIndicator color={colors[TEXT[variant]]} /> : null}
          <Txt variant="button" color={TEXT[variant]}>
            {label}
          </Txt>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', minHeight: layout.buttonHeight + layout.edge },
  compactWrap: { width: 'auto', minHeight: 44 + layout.edge },
  base: {
    minHeight: layout.buttonHeight,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  compact: { minHeight: 44, paddingHorizontal: spacing.lg },
  disabled: { opacity: 0.4 },
});
