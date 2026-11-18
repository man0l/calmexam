import { EXAMS, ExamId, Exam, Topic, TOPICS, getExam } from '../../src/engine';

export const ORIGIN = 'https://calmexam.com';
export const CONTACT = 'hello@calmexam.com';

export const EXAM_PREFIX: Record<ExamId, string> = {
  sat: 'sat-math',
  'ap-calc-ab': 'ap-calculus',
  'a-level': 'a-level-maths',
};

export function hubPath(exam: ExamId): string {
  return '/' + getExam(exam).hubSlug;
}

export function topicPath(t: Topic): string {
  return `/${EXAM_PREFIX[t.exam]}/${t.slug}-practice-problems`;
}

export function findHub(path: string): Exam | undefined {
  return EXAMS.find((e) => '/' + e.hubSlug === path);
}

export function findTopic(path: string): Topic | undefined {
  return TOPICS.find((t) => topicPath(t) === path);
}

/** Days since the Unix epoch: the daily seed for server-rendered sets (fresh daily, cache friendly). */
export function daySeed(now = Date.now()): number {
  return Math.floor(now / 86400000);
}

export function allPaths(): string[] {
  return ['/', ...EXAMS.map((e) => hubPath(e.id)), ...TOPICS.map(topicPath), '/privacy', '/terms'];
}
