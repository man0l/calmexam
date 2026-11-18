import { topicsFor } from '../engine';
import { addDays, todayKey } from './dates';
import { readDemoConfig, type DemoConfig } from './demo';
import { removeKeys, saveJson, STORAGE_KEYS } from './storage';
import type { Profile, ProgressState } from '../types';

function demoProfile(onboarded: boolean): Profile {
  const topics = topicsFor('sat');
  return {
    onboarded,
    exam: 'sat',
    otherExam: null,
    examDate: addDays(todayKey(), 42),
    minutesPerDay: 15,
    worries: ['time', 'careless'],
    placement: [
      { topicId: topics[0].id, correct: true },
      { topicId: topics[3].id, correct: false },
      { topicId: topics[4].id, correct: true },
      { topicId: topics[6].id, correct: false },
      { topicId: topics[8].id, correct: false },
    ],
  };
}

function demoProgress(): ProgressState {
  const today = todayKey();
  const counts = [11, 8, 12, 10];
  const days: Record<string, number> = {};
  counts.forEach((c, i) => {
    days[addDays(today, -(counts.length - i))] = c;
  });
  days[today] = 6;
  days[addDays(today, -9)] = 7;
  days[addDays(today, -10)] = 5;
  const sample: [number, number][] = [
    [14, 12],
    [9, 7],
    [8, 5],
    [11, 6],
    [7, 6],
    [5, 3],
    [6, 3],
    [4, 3],
    [6, 2],
  ];
  const topics: ProgressState['topics'] = {};
  topicsFor('sat').forEach((t, i) => {
    const [attempts, correct] = sample[i % sample.length];
    topics[t.id] = { attempts, correct };
  });
  return {
    topics,
    days,
    explains: { day: today, count: 1 },
    sessions: 6,
    reviewRequested: true,
  };
}

export async function applyDemo(): Promise<DemoConfig | null> {
  const config = readDemoConfig();
  if (!config) return null;
  await removeKeys([STORAGE_KEYS.profile, STORAGE_KEYS.progress, STORAGE_KEYS.entitlement]);
  if (config.onboarding) {
    if (config.id === 'plan') await saveJson(STORAGE_KEYS.profile, demoProfile(false));
  } else {
    await saveJson(STORAGE_KEYS.profile, demoProfile(true));
    await saveJson(STORAGE_KEYS.progress, demoProgress());
  }
  return config;
}
