import { StyleSheet, View } from 'react-native';
import { ExamPicker } from '../../components/ExamPicker';
import { OptionButton } from '../../components/OptionButton';
import { Txt } from '../../components/Txt';
import type { ExamId } from '../../engine';
import type { OtherExam } from '../../types';
import { spacing } from '../../theme';
import { StepLayout } from './StepLayout';

export const OTHER_EXAMS: OtherExam[] = ['O-Level', 'IGCSE', 'GCSE', 'Gaokao', 'Other'];

interface Props {
  exam: ExamId | null;
  otherOpen: boolean;
  otherExam: OtherExam | null;
  progress: number;
  onSelectExam: (exam: ExamId) => void;
  onOpenOther: () => void;
  onSelectOther: (o: OtherExam) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ExamStep({ exam, otherOpen, otherExam, progress, onSelectExam, onOpenOther, onSelectOther, onBack, onNext }: Props) {
  if (otherOpen) {
    return (
      <StepLayout
        title="Which exam are you taking?"
        subtitle="We will start you on SAT Math practice. The algebra, functions and statistics carry over, and we will let you know when your exam arrives."
        progress={progress}
        onBack={onBack}
        onNext={onNext}
        ctaDisabled={!otherExam}
      >
        <View style={styles.list}>
          {OTHER_EXAMS.map((o) => (
            <OptionButton key={o} label={o} state={otherExam === o ? 'selected' : 'idle'} onPress={() => onSelectOther(o)} />
          ))}
        </View>
      </StepLayout>
    );
  }
  return (
    <StepLayout
      title="Which exam are you preparing for?"
      subtitle="Practice is built around its topics and its scoring scale."
      progress={progress}
      onBack={onBack}
      onNext={onNext}
      ctaDisabled={!exam}
    >
      <ExamPicker value={exam} onSelect={onSelectExam} />
      <View style={styles.other}>
        <OptionButton label="My exam isn't listed" onPress={onOpenOther} />
        <Txt variant="caption" color="inkMuted">
          Tell us which one and we will prioritise it.
        </Txt>
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  other: { marginTop: spacing.lg, gap: spacing.sm },
});
