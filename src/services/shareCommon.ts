import { getExam, type Problem } from '../engine';

export const SITE_ORIGIN = 'https://calmexam.com';

export type ShareResult = 'shared' | 'copied' | 'dismissed' | 'failed';

export function challengeUrl(problem: Pick<Problem, 'templateId' | 'seed'>): string {
  return `${SITE_ORIGIN}/c/${problem.templateId}/${problem.seed}`;
}

export function challengeText(problem: Pick<Problem, 'exam'>): string {
  return `Can you solve this ${getExam(problem.exam).shortName} question? Every answer is verified.`;
}
