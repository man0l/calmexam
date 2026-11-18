import { StyleSheet, View } from 'react-native';
import { problemsPerDay } from '../services/practice';
import { spacing } from '../theme';
import { OptionButton } from './OptionButton';

export const MINUTE_OPTIONS = [10, 15, 20, 30];

const NOTE: Record<number, string> = {
  10: 'A light daily touch',
  15: 'Steady, most popular',
  20: 'Solid progress',
  30: 'Serious push',
};

export function MinutesPicker({ value, onChange }: { value: number; onChange: (m: number) => void }) {
  return (
    <View style={styles.list}>
      {MINUTE_OPTIONS.map((m) => (
        <OptionButton
          key={m}
          testID={`minutes-${m}`}
          label={`${m} minutes a day`}
          caption={`${NOTE[m]} · about ${problemsPerDay(m)} problems`}
          state={value === m ? 'selected' : 'idle'}
          onPress={() => onChange(m)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
});
