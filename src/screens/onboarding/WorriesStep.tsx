import { StyleSheet, View } from 'react-native';
import { Chip } from '../../components/Chip';
import type { Worry } from '../../types';
import { spacing } from '../../theme';
import { StepLayout } from './StepLayout';

export const WORRY_LABELS: Record<Worry, string> = {
  time: 'Running out of time',
  'weak-topics': 'Weak topics',
  anxiety: 'Test anxiety',
  careless: 'Careless mistakes',
};

interface Props {
  value: Worry[];
  progress: number;
  onToggle: (w: Worry) => void;
  onBack: () => void;
  onNext: () => void;
}

export function WorriesStep({ value, progress, onToggle, onBack, onNext }: Props) {
  return (
    <StepLayout
      title="What worries you most?"
      subtitle="Pick any that apply. We will shape your sessions around them."
      progress={progress}
      onBack={onBack}
      onNext={onNext}
      cta={value.length ? 'Continue' : 'Skip for now'}
    >
      <View style={styles.wrap}>
        {(Object.keys(WORRY_LABELS) as Worry[]).map((w) => (
          <Chip key={w} label={WORRY_LABELS[w]} selected={value.includes(w)} onPress={() => onToggle(w)} />
        ))}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});
