import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { OptionButton } from '../../components/OptionButton';
import { SegmentedProgress } from '../../components/ProgressBar';
import { LETTERS } from '../../components/PromptCard';
import { ScreenShell } from '../../components/ScreenShell';
import { TopBar } from '../../components/TopBar';
import { Txt } from '../../components/Txt';
import { getTopic, placementTest, type ExamId } from '../../engine';
import { tapHaptic } from '../../services/haptics';
import type { PlacementResult } from '../../types';
import { colors, radii, spacing } from '../../theme';

const ADVANCE_MS = 350;

interface Props {
  exam: ExamId;
  seed: number;
  initialIndex?: number;
  onBack: () => void;
  onDone: (results: PlacementResult[]) => void;
}

export function PlacementStep({ exam, seed, initialIndex = 0, onBack, onDone }: Props) {
  const problems = useMemo(() => placementTest(exam, seed), [exam, seed]);
  const [index, setIndex] = useState(initialIndex);
  const [chosen, setChosen] = useState<number | null>(null);
  const [results, setResults] = useState<PlacementResult[]>(() =>
    problems.slice(0, initialIndex).map((p, i) => ({ topicId: p.topicId, correct: i % 2 === 0 })),
  );
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const problem = problems[index];
  const topic = getTopic(problem.topicId);

  const advance = (correct: boolean) => {
    const updated = [...results, { topicId: problem.topicId, correct }];
    if (index + 1 >= problems.length) {
      onDone(updated);
      return;
    }
    setResults(updated);
    setIndex(index + 1);
    setChosen(null);
  };

  const pick = (i: number) => {
    if (chosen !== null) return;
    tapHaptic();
    setChosen(i);
    timer.current = setTimeout(() => advance(i === problem.answerIndex), ADVANCE_MS);
  };

  const back = () => {
    if (timer.current) clearTimeout(timer.current);
    if (index === 0) {
      onBack();
      return;
    }
    setIndex(index - 1);
    setResults(results.slice(0, -1));
    setChosen(null);
  };

  return (
    <ScreenShell header={<TopBar onBack={back} center={<SegmentedProgress total={problems.length} done={index + 1} />} />}>
      <View style={styles.head}>
        <Txt variant="title">Quick check</Txt>
        <Txt variant="body" color="inkMuted">
          Five real questions to find your starting point. No timer.
        </Txt>
      </View>
      <View style={styles.card}>
        <Txt variant="captionStrong" color="primary">
          {`QUESTION ${index + 1} OF ${problems.length}${topic ? ` · ${topic.name.toUpperCase()}` : ''}`}
        </Txt>
        <Txt variant="math" selectable testID="problem-prompt">
          {problem.prompt}
        </Txt>
        <View style={styles.options}>
          {problem.choices.map((c, i) => (
            <OptionButton
              key={`${problem.id}-${i}`}
              testID={`placement-option-${i}`}
              letter={LETTERS[i]}
              label={c}
              state={chosen === i ? 'selected' : chosen !== null ? 'dim' : 'idle'}
              onPress={() => pick(i)}
            />
          ))}
        </View>
      </View>
      <Button testID="placement-skip" label="I'm not sure" variant="ghost" compact onPress={() => chosen === null && advance(false)} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  head: { gap: spacing.sm, marginBottom: spacing.xl },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  options: { gap: spacing.sm, marginTop: spacing.xs },
});
