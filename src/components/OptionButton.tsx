import { Pressable, StyleSheet, View } from 'react-native';
import { colors, layout, radii, spacing, type ColorToken } from '../theme';
import { Icon } from './Icon';
import { Txt } from './Txt';

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dim';

interface Props {
  label: string;
  letter?: string;
  caption?: string;
  state?: OptionState;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

const BG: Record<OptionState, string> = {
  idle: colors.surface,
  selected: colors.primarySoft,
  correct: colors.correctSoft,
  wrong: colors.wrongSoft,
  dim: colors.surface,
};

const BORDER: Record<OptionState, string> = {
  idle: colors.border,
  selected: colors.primary,
  correct: colors.correct,
  wrong: colors.wrong,
  dim: colors.border,
};

const EDGE: Record<OptionState, string> = {
  idle: colors.edge,
  selected: colors.primaryEdge,
  correct: colors.correctEdge,
  wrong: colors.wrong,
  dim: colors.border,
};

const BADGE: Record<OptionState, string> = {
  idle: colors.inset,
  selected: colors.primary,
  correct: colors.correct,
  wrong: colors.wrong,
  dim: colors.inset,
};

const LETTER: Record<OptionState, ColorToken> = {
  idle: 'inkMuted',
  selected: 'onPrimary',
  correct: 'onPrimary',
  wrong: 'onPrimary',
  dim: 'inkFaint',
};

export function OptionButton({ label, letter, caption, state = 'idle', onPress, disabled, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected: state === 'selected', disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { backgroundColor: BG[state], borderColor: BORDER[state], borderBottomColor: EDGE[state] },
        pressed && state === 'idle' && styles.pressed,
        state === 'dim' && styles.dim,
      ]}
    >
      {letter ? (
        <View style={[styles.letter, { backgroundColor: BADGE[state] }]}>
          <Txt variant="label" color={LETTER[state]}>
            {letter}
          </Txt>
        </View>
      ) : null}
      <View style={styles.text}>
        <Txt variant={letter ? 'math' : 'bodyStrong'}>{label}</Txt>
        {caption ? (
          <Txt variant="small" color="inkMuted">
            {caption}
          </Txt>
        ) : null}
      </View>
      {state === 'correct' ? <Icon name="check" color="correct" /> : null}
      {state === 'wrong' ? <Icon name="close" color="wrong" /> : null}
      {state === 'selected' && !letter ? <Icon name="check" color="primary" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: layout.optionMinHeight,
    borderRadius: radii.option,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dim: { opacity: 0.55 },
  pressed: { borderBottomWidth: 1.5, marginTop: 2.5, backgroundColor: colors.inset },
  letter: {
    width: 34,
    height: 34,
    borderRadius: radii.input - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
});
