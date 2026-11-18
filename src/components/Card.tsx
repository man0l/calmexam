import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, layout, radii, spacing } from '../theme';

type Variant = 'surface' | 'inset' | 'premium' | 'correct' | 'wrong' | 'soft';

const BG: Record<Variant, string> = {
  surface: colors.surface,
  inset: colors.inset,
  premium: colors.amberSoft,
  correct: colors.correctSoft,
  wrong: colors.wrongSoft,
  soft: colors.primarySoft,
};

const BORDER: Record<Variant, string> = {
  surface: colors.border,
  inset: colors.inset,
  premium: colors.amberSoft,
  correct: colors.correctSoft,
  wrong: colors.wrongSoft,
  soft: colors.primarySoft,
};

export function Card({ children, variant = 'surface', style }: { children: ReactNode; variant?: Variant; style?: ViewStyle }) {
  return <View style={[styles.card, { backgroundColor: BG[variant], borderColor: BORDER[variant] }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.card, borderWidth: layout.hairline, padding: spacing.xl, gap: spacing.md },
});
