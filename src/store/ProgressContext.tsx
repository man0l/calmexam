import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Problem } from '../engine';
import { todayKey } from '../services/dates';
import { requestStoreReview } from '../services/review';
import { loadJson, saveJson, STORAGE_KEYS } from '../services/storage';
import { bestStreak, currentStreak } from '../services/streak';
import type { ProgressState } from '../types';

export const FREE_EXPLANATIONS_PER_DAY = 3;
const REVIEW_SESSION_THRESHOLD = 0.8;
const REVIEW_TOPIC_CORRECT = 10;

export const EMPTY_PROGRESS: ProgressState = {
  topics: {},
  days: {},
  explains: { day: '', count: 0 },
  sessions: 0,
  reviewRequested: false,
};

interface ProgressValue {
  ready: boolean;
  progress: ProgressState;
  todayCount: number;
  totalSolved: number;
  totalCorrect: number;
  streak: number;
  best: number;
  explanationsUsedToday: number;
  recordAnswer: (problem: Problem, correct: boolean) => void;
  recordSessionEnd: (correct: number, total: number) => void;
  consumeExplanation: () => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);
  const reviewAsked = useRef(false);

  useEffect(() => {
    loadJson<ProgressState>(STORAGE_KEYS.progress).then((saved) => {
      if (saved) {
        setProgress({ ...EMPTY_PROGRESS, ...saved });
        reviewAsked.current = !!saved.reviewRequested;
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) saveJson(STORAGE_KEYS.progress, progress);
  }, [progress, ready]);

  const askReview = useCallback(() => {
    if (reviewAsked.current) return;
    reviewAsked.current = true;
    setProgress((p) => ({ ...p, reviewRequested: true }));
    void requestStoreReview();
  }, []);

  const recordAnswer = useCallback(
    (problem: Problem, correct: boolean) => {
      const day = todayKey();
      let topicCorrect = 0;
      setProgress((p) => {
        const prev = p.topics[problem.topicId] ?? { attempts: 0, correct: 0 };
        const next = { attempts: prev.attempts + 1, correct: prev.correct + (correct ? 1 : 0) };
        topicCorrect = next.correct;
        return {
          ...p,
          topics: { ...p.topics, [problem.topicId]: next },
          days: { ...p.days, [day]: (p.days[day] ?? 0) + 1 },
        };
      });
      if (correct && topicCorrect >= REVIEW_TOPIC_CORRECT) askReview();
    },
    [askReview],
  );

  const recordSessionEnd = useCallback(
    (correct: number, total: number) => {
      setProgress((p) => ({ ...p, sessions: p.sessions + 1 }));
      if (total > 0 && correct / total >= REVIEW_SESSION_THRESHOLD) askReview();
    },
    [askReview],
  );

  const consumeExplanation = useCallback(() => {
    const day = todayKey();
    setProgress((p) => ({
      ...p,
      explains: { day, count: (p.explains.day === day ? p.explains.count : 0) + 1 },
    }));
  }, []);

  const reset = useCallback(() => {
    setProgress({ ...EMPTY_PROGRESS, reviewRequested: reviewAsked.current });
  }, []);

  const value = useMemo(() => {
    const day = todayKey();
    const stats = Object.values(progress.topics);
    return {
      ready,
      progress,
      todayCount: progress.days[day] ?? 0,
      totalSolved: stats.reduce((n, s) => n + s.attempts, 0),
      totalCorrect: stats.reduce((n, s) => n + s.correct, 0),
      streak: currentStreak(progress.days, day),
      best: bestStreak(progress.days),
      explanationsUsedToday: progress.explains.day === day ? progress.explains.count : 0,
      recordAnswer,
      recordSessionEnd,
      consumeExplanation,
      reset,
    };
  }, [ready, progress, recordAnswer, recordSessionEnd, consumeExplanation, reset]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress outside ProgressProvider');
  return ctx;
}
