import { StyleSheet, View } from 'react-native';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { Txt } from '../../components/Txt';
import type { Exam, StudyPlan } from '../../engine';
import type { Worry } from '../../types';
import { colors, radii, spacing } from '../../theme';
import { StepLayout } from './StepLayout';

const WORRY_PLAN: Record<Worry, string> = {
  time: 'Pacing tips on the questions that eat the most time',
  'weak-topics': 'Extra reps on your weakest topics every day',
  anxiety: 'No timers and no streak guilt, just steady reps',
  careless: 'Common pitfalls shown after every answer',
};

interface Props {
  exam: Exam;
  plan: StudyPlan;
  minutes: number;
  worries: Worry[];
  progress: number;
  onBack: () => void;
  onNext: () => void;
}

export function PlanStep({ exam, plan, minutes, worries, progress, onBack, onNext }: Props) {
  return (
    <StepLayout
      title={`Your ${plan.daysLeft}-day plan is ready`}
      subtitle={`Built for ${exam.name} from your quick check.`}
      progress={progress}
      onBack={onBack}
      onNext={onNext}
    >
      <Card>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Txt variant="h2">{String(plan.daysLeft)}</Txt>
            <Txt variant="caption" color="inkMuted">
              days
            </Txt>
          </View>
          <View style={styles.stat}>
            <Txt variant="h2">{String(minutes)}</Txt>
            <Txt variant="caption" color="inkMuted">
              min a day
            </Txt>
          </View>
          <View style={styles.stat}>
            <Txt variant="h2">{String(plan.problemsPerDay)}</Txt>
            <Txt variant="caption" color="inkMuted">
              problems a day
            </Txt>
          </View>
        </View>
        <View style={styles.divider} />
        <Txt variant="captionStrong" color="inkMuted">
          {`${plan.weakTopics.length} TOPICS TO FOCUS ON`}
        </Txt>
        {plan.weakTopics.map((t, i) => (
          <View key={t.id} style={styles.topic}>
            <View style={styles.num}>
              <Txt variant="label" color="primary">
                {String(i + 1)}
              </Txt>
            </View>
            <View style={styles.flex}>
              <Txt variant="bodyStrong">{t.name}</Txt>
              <Txt variant="small" color="inkMuted">
                {t.blurb}
              </Txt>
            </View>
          </View>
        ))}
      </Card>
      {worries.length ? (
        <View style={styles.worries}>
          {worries.map((w) => (
            <View key={w} style={styles.worry}>
              <Icon name="check" color="primary" size={20} />
              <Txt variant="small" style={styles.flex}>
                {WORRY_PLAN[w]}
              </Txt>
            </View>
          ))}
        </View>
      ) : null}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center', flex: 1 },
  divider: { height: 1, backgroundColor: colors.border },
  topic: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  num: {
    width: 28,
    height: 28,
    borderRadius: radii.chip,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  worries: { gap: spacing.sm, marginTop: spacing.lg },
  worry: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
});
