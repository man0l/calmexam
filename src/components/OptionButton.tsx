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

const LETTER: Record<OptionState, ColorToken> = {
  idle: 'inkMuted',
  selected: 'primary',
  correct: 'correct',
  wrong: 'wrong',
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
        { backgroundColor: pressed && state === 'idle' ? colors.inset : BG[state], borderColor: BORDER[state] },
        state === 'dim' && styles.dim,
      ]}
    >
      {letter ? (
        <View style={[styles.letter, { borderColor: BORDER[state] }]}>
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
    borderWidth: layout.hairline,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dim: { opacity: 0.55 },
  letter: {
    width: 32,
    height: 32,
    borderRadius: radii.chip,
    borderWidth: layout.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
});
