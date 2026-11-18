import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '../../components/Card';
import { ProjectionGraph } from '../../components/ProjectionGraph';
import { TopicArt } from '../../components/TopicArt';
import { Txt } from '../../components/Txt';
import { formatScore, type Exam, type StudyPlan } from '../../engine';
import type { PlacementResult } from '../../types';
import { colors, radii, spacing } from '../../theme';
import { StepLayout } from './StepLayout';

const FOCUS_COUNT = 3;

interface Props {
  exam: Exam;
  plan: StudyPlan;
  minutes: number;
  placement: PlacementResult[];
  progress: number;
  onBack: () => void;
  onNext: () => void;
}

export function PlanStep({ exam, plan, minutes, placement, progress, onBack, onNext }: Props) {
  const correct = placement.filter((r) => r.correct).length;
  const { now, target } = plan.projected;
  const [graphReady, setGraphReady] = useState(false);
  const onGraphReady = useCallback(() => setGraphReady(true), []);
  const start = formatScore(exam.id, now);
  return (
    <StepLayout
      deferReady={!graphReady}
      title={`Your plan for ${formatScore(exam.id, target)}, ready in ${plan.daysLeft} days`}
      subtitle={
        placement.length
          ? `You got ${correct} of ${placement.length} right, so you start around ${start}. Here is your path.`
          : `You start around ${start}. Here is your path.`
      }
      progress={progress}
      onBack={onBack}
      onNext={onNext}
    >
      <Card>
        <Txt variant="captionStrong" color="inkMuted">
          {`YOUR ${exam.scale.label.toUpperCase()}`}
        </Txt>
        <ProjectionGraph exam={exam.id} now={now} target={target} daysLeft={plan.daysLeft} height={160} onReady={onGraphReady} />
      </Card>
      <View style={styles.stats}>
        {[
          [String(minutes), 'min a day'],
          [String(plan.problemsPerDay), 'problems a day'],
          [String(plan.weakTopics.length), 'focus topics'],
        ].map(([n, l]) => (
          <View key={l} style={styles.stat}>
            <Txt variant="number">{n}</Txt>
            <Txt variant="caption" color="inkMuted">
              {l}
            </Txt>
          </View>
        ))}
      </View>
      <View style={styles.topics}>
        <Txt variant="captionStrong" color="inkMuted">
          FOCUS FIRST
        </Txt>
        {plan.weakTopics.slice(0, FOCUS_COUNT).map((t, i) => (
          <View key={t.id} style={styles.topic}>
            <TopicArt topicId={t.id} index={i} size={40} />
            <Txt variant="bodyStrong" style={styles.flex}>
              {t.name}
            </Txt>
          </View>
        ))}
      </View>
      <Txt variant="caption" color="inkMuted" style={styles.note}>
        An estimate from your quick check and the days you have left, assuming you practise most days. Not a guarantee.
      </Txt>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radii.option,
    backgroundColor: colors.primarySoft,
  },
  stat: { flex: 1, alignItems: 'center' },
  topics: { gap: spacing.sm, marginTop: spacing.xl },
  topic: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  flex: { flex: 1 },
  note: { marginTop: spacing.lg },
});
