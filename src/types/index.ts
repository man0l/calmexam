import type { ExamId } from '../engine';

export type Worry = 'time' | 'weak-topics' | 'anxiety' | 'careless';

export type OtherExam = 'O-Level' | 'IGCSE' | 'GCSE' | 'Gaokao' | 'Other';

export interface PlacementResult {
  topicId: string;
  correct: boolean;
}

export interface Profile {
  onboarded: boolean;
  exam: ExamId;
  otherExam: OtherExam | null;
  examDate: string;
  minutesPerDay: number;
  worries: Worry[];
  placement: PlacementResult[];
}

export interface TopicStat {
  attempts: number;
  correct: number;
}

export interface ProgressState {
  topics: Record<string, TopicStat>;
  days: Record<string, number>;
  explains: { day: string; count: number };
  sessions: number;
  reviewRequested: boolean;
}

export type PlanId = 'annual' | 'monthly';

export interface PlanOption {
  id: PlanId;
  priceString: string;
  price: number;
  currencyCode: string;
}

export type SessionKind = 'today' | 'topic' | 'demo';

export interface SessionParams {
  kind: SessionKind;
  topicId?: string;
  seed: number;
  demoAnswer?: 'correct' | 'wrong';
  demoExplain?: boolean;
}
