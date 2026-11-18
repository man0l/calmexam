import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { OptionButton } from '../../components/OptionButton';
import { SegmentedProgress } from '../../components/ProgressBar';
import { LETTERS, PromptCard } from '../../components/PromptCard';
import { ScreenShell } from '../../components/ScreenShell';
import { TopBar } from '../../components/TopBar';
import { Txt } from '../../components/Txt';
import { placementTest, type ExamId } from '../../engine';
import { tapHaptic } from '../../services/haptics';
import type { PlacementResult } from '../../types';
import { spacing } from '../../theme';

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
  const problem = problems[index];

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

  const back = () => {
    if (index === 0) {
      onBack();
      return;
    }
    setIndex(index - 1);
    setResults(results.slice(0, -1));
    setChosen(null);
  };

  return (
    <ScreenShell
      header={<TopBar onBack={back} center={<SegmentedProgress total={problems.length} done={index + 1} />} />}
      footer={
        <Button
          testID="placement-next"
          label={index + 1 >= problems.length ? 'See my results' : 'Next question'}
          onPress={() => chosen !== null && advance(chosen === problem.answerIndex)}
          disabled={chosen === null}
        />
      }
    >
      <View style={styles.head}>
        <Txt variant="captionStrong" color="primary">
          {`QUICK CHECK · ${index + 1} OF ${problems.length}`}
        </Txt>
        <Txt variant="small" color="inkMuted">
          Five real questions to find your starting point. No pressure, no timer.
        </Txt>
      </View>
      <PromptCard problem={problem} />
      <View style={styles.options}>
        {problem.choices.map((c, i) => (
          <OptionButton
            key={`${problem.id}-${i}`}
            testID={`placement-option-${i}`}
            letter={LETTERS[i]}
            label={c}
            state={chosen === i ? 'selected' : 'idle'}
            onPress={() => {
              tapHaptic();
              setChosen(i);
            }}
          />
        ))}
      </View>
      <Button label="I'm not sure" variant="ghost" onPress={() => advance(false)} compact />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  head: { gap: spacing.xs, marginBottom: spacing.lg },
  options: { gap: spacing.md, marginTop: spacing.lg, marginBottom: spacing.md },
});
