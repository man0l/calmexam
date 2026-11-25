import { EXAMS, ExamId, Exam, Topic, TOPICS, getExam } from '../../src/engine';
import { LANDINGS, Landing } from './landing';

export { findLanding } from './landing';

export const ORIGIN = 'https://calmexam.com';
export const CONTACT = 'hello@calmexam.com';
export const APP_STORE_ID = '6836514358';
export const APP_STORE_URL = `https://apps.apple.com/app/calmexam/id${APP_STORE_ID}`;

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

export function landingPath(l: Landing): string {
  return '/' + l.slug;
}

export function landingFor(exam: ExamId): Landing[] {
  return LANDINGS.filter((l) => l.exam === exam);
}

export function allPaths(): string[] {
  return ['/', ...EXAMS.map((e) => hubPath(e.id)), ...LANDINGS.map(landingPath), ...TOPICS.map(topicPath), '/privacy', '/terms'];
}
