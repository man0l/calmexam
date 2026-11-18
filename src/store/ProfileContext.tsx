import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildPlan, getExam, type Exam, type StudyPlan } from '../engine';
import { addDays, todayKey } from '../services/dates';
import { loadJson, saveJson, STORAGE_KEYS } from '../services/storage';
import type { Profile } from '../types';

export const DEFAULT_PROFILE: Profile = {
  onboarded: false,
  exam: 'sat',
  otherExam: null,
  examDate: addDays(todayKey(), 42),
  minutesPerDay: 15,
  worries: [],
  placement: [],
};

interface ProfileValue {
  ready: boolean;
  profile: Profile;
  exam: Exam;
  plan: StudyPlan;
  update: (patch: Partial<Profile>) => void;
  reset: () => void;
}

const ProfileContext = createContext<ProfileValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    loadJson<Profile>(STORAGE_KEYS.profile).then((saved) => {
      if (saved) setProfile({ ...DEFAULT_PROFILE, ...saved });
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) saveJson(STORAGE_KEYS.profile, profile);
  }, [profile, ready]);

  const update = useCallback((patch: Partial<Profile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  const reset = useCallback(() => setProfile({ ...DEFAULT_PROFILE, examDate: addDays(todayKey(), 42) }), []);

  const plan = useMemo(
    () =>
      buildPlan({
        exam: profile.exam,
        examDate: profile.examDate,
        today: todayKey(),
        minutesPerDay: profile.minutesPerDay,
        results: profile.placement,
      }),
    [profile.exam, profile.examDate, profile.minutesPerDay, profile.placement],
  );

  const value = useMemo(
    () => ({ ready, profile, exam: getExam(profile.exam), plan, update, reset }),
    [ready, profile, plan, update, reset],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile outside ProfileProvider');
  return ctx;
}
