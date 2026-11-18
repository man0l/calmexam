import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '../../components/Card';
import { ProjectionGraph } from '../../components/ProjectionGraph';
import { Txt } from '../../components/Txt';
import { formatScore, type Exam, type StudyPlan } from '../../engine';
import type { PlacementResult } from '../../types';
import { spacing } from '../../theme';
import { StepLayout } from './StepLayout';

interface Props {
  exam: Exam;
  plan: StudyPlan;
  placement: PlacementResult[];
  progress: number;
  onBack: () => void;
  onNext: () => void;
}

export function ProjectionStep({ exam, plan, placement, progress, onBack, onNext }: Props) {
  const correct = placement.filter((r) => r.correct).length;
  const { now, target } = plan.projected;
  const [graphReady, setGraphReady] = useState(false);
  const onGraphReady = useCallback(() => setGraphReady(true), []);
  return (
    <StepLayout
      deferReady={!graphReady}
      title={`You could reach ${formatScore(exam.id, target)} by exam day`}
      subtitle={
        placement.length
          ? `You got ${correct} of ${placement.length} right. That puts you around ${formatScore(exam.id, now)} today.`
          : `Starting from around ${formatScore(exam.id, now)} today.`
      }
      progress={progress}
      onBack={onBack}
      onNext={onNext}
    >
      <Card>
        <Txt variant="captionStrong" color="inkMuted">
          {exam.scale.label.toUpperCase()}
        </Txt>
        <ProjectionGraph exam={exam.id} now={now} target={target} daysLeft={plan.daysLeft} onReady={onGraphReady} />
      </Card>
      <View style={styles.note}>
        <Txt variant="caption" color="inkMuted">
          An estimate from your quick check and the days you have left, assuming you practise most days. It is not a
          guarantee.
        </Txt>
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  note: { marginTop: spacing.md },
});
