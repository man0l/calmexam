import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ExplainCard } from '../components/ExplainCard';
import { OptionButton, type OptionState } from '../components/OptionButton';
import { ProgressBar } from '../components/ProgressBar';
import { LETTERS, PromptCard } from '../components/PromptCard';
import { ScreenShell } from '../components/ScreenShell';
import { SolutionCard } from '../components/SolutionCard';
import { TopBar } from '../components/TopBar';
import { Txt } from '../components/Txt';
import { getTopic, type ExamId, type Problem, type Topic } from '../engine';
import { useWeakTopics } from '../hooks/useWeakTopics';
import type { RootStackParamList } from '../navigation/types';
import { explainMistake, localExplanation, type Explanation } from '../services/api';
import { resultHaptic } from '../services/haptics';
import { shareProblem } from '../services/share';
import {
  buildSimilar,
  buildTodaySession,
  buildTopicSession,
  randomSeed,
  sessionMessage,
  SIMILAR_COUNT,
} from '../services/practice';
import { useProfile } from '../store/ProfileContext';
import { FREE_EXPLANATIONS_PER_DAY, useProgress } from '../store/ProgressContext';
import { useSubscription } from '../store/SubscriptionContext';
import { layout, spacing } from '../theme';
import type { SessionParams } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Session'>;

const DEMO_SCROLL_LEAD = 150;

function buildSession(exam: ExamId, params: SessionParams, weak: Topic[], seed: number): Problem[] {
  if (params.kind === 'topic' && params.topicId) return buildTopicSession(exam, params.topicId, seed);
  if (params.kind === 'night') return buildTodaySession(exam, weak, seed).slice(0, 1);
  return buildTodaySession(exam, weak, seed);
}

interface ExplainState {
  loading: boolean;
  explanation: Explanation | null;
}

export function PracticeSessionScreen({ navigation, route }: Props) {
  const params = route.params;
  const { profile } = useProfile();
  const { recordAnswer, recordSessionEnd, consumeExplanation, explanationsUsedToday } = useProgress();
  const { subscribed, openPaywall } = useSubscription();
  const weak = useWeakTopics();
  const [problems, setProblems] = useState<Problem[]>(() => buildSession(profile.exam, params, weak, params.seed));
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(() => {
    if (!params.demoAnswer) return null;
    const first = problems[0];
    return params.demoAnswer === 'correct' ? first.answerIndex : (first.answerIndex + 1) % first.choices.length;
  });
  const [results, setResults] = useState<boolean[]>([]);
  const [explain, setExplain] = useState<ExplainState | null>(() => {
    if (!params.demoExplain || chosen === null) return null;
    const first = problems[0];
    return { loading: false, explanation: { text: localExplanation(first, first.choices[chosen]), source: 'steps' } };
  });
  const [similarFor, setSimilarFor] = useState<Set<number>>(() => new Set());
  const [finished, setFinished] = useState(false);
  const [afterY, setAfterY] = useState<number | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const requestId = useRef(0);

  const problem = problems[index];
  const leave = () => (navigation.canGoBack() ? navigation.goBack() : navigation.replace('Tabs'));
  const answered = chosen !== null;
  const correct = answered && chosen === problem.answerIndex;
  const night = params.kind === 'night';
  const title =
    params.kind === 'topic' && params.topicId
      ? (getTopic(params.topicId)?.name ?? 'Practice')
      : night
        ? 'One problem, then sleep'
        : 'Today’s session';
  const missesInRow = (() => {
    let n = 0;
    for (let i = results.length - 1; i >= 0 && !results[i]; i--) n++;
    return n;
  })();

  const choose = (i: number) => {
    if (answered) return;
    const ok = i === problem.answerIndex;
    setChosen(i);
    resultHaptic(ok);
    recordAnswer(problem, ok);
    setResults((r) => [...r, ok]);
  };

  const next = () => {
    requestId.current++;
    setExplain(null);
    if (index + 1 >= problems.length) {
      const score = results.filter(Boolean).length;
      recordSessionEnd(score, results.length);
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setChosen(null);
    setShareNote(null);
  };

  const share = async () => {
    const res = await shareProblem(problem);
    setShareNote(res === 'copied' ? 'Link copied. Paste it to a friend.' : res === 'failed' ? 'Couldn’t open sharing on this device.' : null);
  };

  const explainNow = useCallback(async () => {
    if (chosen === null) return;
    if (!subscribed && explanationsUsedToday >= FREE_EXPLANATIONS_PER_DAY) {
      openPaywall();
      return;
    }
    const id = ++requestId.current;
    setExplain({ loading: true, explanation: null });
    const result = await explainMistake(problem, problem.choices[chosen]);
    if (id !== requestId.current) return;
    consumeExplanation();
    setExplain({ loading: false, explanation: result });
  }, [chosen, subscribed, explanationsUsedToday, openPaywall, problem, consumeExplanation]);

  const addSimilar = () => {
    const extra = buildSimilar(problem, randomSeed());
    setProblems((ps) => [...ps.slice(0, index + 1), ...extra, ...ps.slice(index + 1)]);
    setSimilarFor((s) => new Set(s).add(index));
  };

  const restart = () => {
    setProblems(buildSession(profile.exam, params, weak, randomSeed()));
    setIndex(0);
    setChosen(null);
    setResults([]);
    setExplain(null);
    setSimilarFor(new Set());
    setShareNote(null);
    setFinished(false);
  };

  if (finished && night) {
    const score = results.filter(Boolean).length;
    return (
      <ScreenShell
        header={<TopBar onBack={() => leave()} backIcon="close" />}
        footer={
          <>
            <Button testID="session-done" label="Goodnight" onPress={() => leave()} />
            <Button label="One more" variant="ghost" onPress={restart} />
          </>
        }
      >
        <View style={styles.summary}>
          <Txt variant="h3" color="primary">
            That counts
          </Txt>
          <Txt variant="display">{`${score}/${results.length}`}</Txt>
          <Txt variant="body" align="center" style={styles.message}>
            {score === results.length
              ? 'One solved problem tonight is one more you will recognise on exam day.'
              : 'You looked at the steps instead of scrolling. That is studying. Sleep on it.'}
          </Txt>
        </View>
      </ScreenShell>
    );
  }

  if (finished) {
    const score = results.filter(Boolean).length;
    const pct = results.length ? Math.round((score / results.length) * 100) : 0;
    return (
      <ScreenShell
        header={<TopBar onBack={() => leave()} backIcon="close" />}
        footer={
          <>
            <Button testID="session-done" label="Done" onPress={() => leave()} />
            <Button label="Practise again" variant="ghost" onPress={restart} />
          </>
        }
      >
        <View style={styles.summary}>
          <Txt variant="h3" color="primary">
            Session complete
          </Txt>
          <Txt variant="display">{`${score}/${results.length}`}</Txt>
          <Txt variant="bodyStrong" color="inkMuted">{`${pct}% correct`}</Txt>
          <Txt variant="body" align="center" style={styles.message}>
            {sessionMessage(score, results.length)}
          </Txt>
        </View>
        <Card>
          <ProgressBar value={results.length ? score / results.length : 0} color="correct" />
          <Txt variant="small" color="inkMuted">
            {`${results.length - score} to review. Every answer you saw today was verified.`}
          </Txt>
        </Card>
      </ScreenShell>
    );
  }

  const optionState = (i: number): OptionState => {
    if (!answered) return 'idle';
    if (i === problem.answerIndex) return 'correct';
    if (i === chosen) return 'wrong';
    return 'dim';
  };

  const freeLeft = Math.max(0, FREE_EXPLANATIONS_PER_DAY - explanationsUsedToday);
  const demoStart =
    params.demoAnswer && index === 0 ? (params.demoExplain ? 'end' : afterY === null ? null : afterY - DEMO_SCROLL_LEAD) : undefined;

  return (
    <ScreenShell
      key={problem.id + index}
      startAt={demoStart}
      header={
        <TopBar
          onBack={() => leave()}
          backIcon="close"
          center={<ProgressBar value={(index + (answered ? 1 : 0)) / problems.length} height={layout.progressHeight} />}
          right={
            <Txt variant="label" color="inkMuted" style={styles.count}>
              {`${index + 1}/${problems.length}`}
            </Txt>
          }
        />
      }
      footer={answered ? <Button testID="session-next" label={index + 1 >= problems.length ? 'Finish' : 'Next'} onPress={next} /> : undefined}
    >
      <Txt variant="caption" color="inkMuted" style={styles.title}>
        {title.toUpperCase()}
      </Txt>
      <PromptCard problem={problem} />
      <View style={styles.options}>
        {problem.choices.map((c, i) => (
          <OptionButton
            key={`${problem.id}-${i}`}
            testID={`option-${i}`}
            letter={LETTERS[i]}
            label={c}
            state={optionState(i)}
            disabled={answered}
            onPress={() => choose(i)}
          />
        ))}
      </View>

      {answered ? (
        <View style={styles.after} onLayout={(e) => setAfterY(e.nativeEvent.layout.y)}>
          <Txt variant="h3" color={correct ? 'correctEdge' : 'wrongText'}>
            {correct ? 'Correct. Nicely done.' : `Not quite. The verified answer is ${LETTERS[problem.answerIndex]}.`}
          </Txt>
          {!correct ? (
            <Txt variant="small" color="inkMuted">
              {missesInRow >= 2
                ? 'A few misses in a row is normal on a topic that’s still new. Slow down and fix one shape at a time.'
                : 'One wrong answer isn’t a pattern. Three like this will fix it.'}
            </Txt>
          ) : null}
          <SolutionCard problem={problem} />
          {!correct ? (
            explain ? (
              <ExplainCard loading={explain.loading} explanation={explain.explanation} />
            ) : (
              <View style={styles.explainCta}>
                <Button testID="explain-mistake" label="Explain my mistake" variant="secondary" onPress={explainNow} />
                {!subscribed ? (
                  <Txt variant="caption" color="inkMuted" align="center">
                    {freeLeft > 0
                      ? `${freeLeft} free ${freeLeft === 1 ? 'explanation' : 'explanations'} left today`
                      : 'Free explanations used for today'}
                  </Txt>
                ) : null}
              </View>
            )
          ) : null}
          {!similarFor.has(index) ? (
            <Button
              testID="fix-it"
              label={correct ? `Practise ${SIMILAR_COUNT} similar` : `Fix it: ${SIMILAR_COUNT} like this`}
              variant={correct ? 'ghost' : 'secondary'}
              onPress={addSimilar}
            />
          ) : (
            <Txt variant="caption" color="inkMuted" align="center">
              {`${SIMILAR_COUNT} similar problems added next`}
            </Txt>
          )}
          <Button testID="share-problem" label="Send this to a friend" variant="ghost" onPress={share} />
          {shareNote ? (
            <Txt variant="caption" color="inkMuted" align="center">
              {shareNote}
            </Txt>
          ) : null}
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.sm },
  options: { gap: spacing.md, marginTop: spacing.lg },
  after: { gap: spacing.lg, marginTop: spacing.xl },
  explainCta: { gap: spacing.sm },
  count: { fontVariant: ['tabular-nums'] },
  summary: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.huge },
  message: { maxWidth: 320, marginTop: spacing.sm },
});
