import { useMemo } from 'react';
import type { Topic } from '../engine';
import { weakestTopics } from '../services/practice';
import { useProfile } from '../store/ProfileContext';
import { useProgress } from '../store/ProgressContext';

export function useWeakTopics(): Topic[] {
  const { profile, plan } = useProfile();
  const { progress } = useProgress();
  return useMemo(
    () => weakestTopics(profile.exam, progress.topics, plan.weakTopics),
    [profile.exam, progress.topics, plan.weakTopics],
  );
}
