import type { Problem } from '../engine';
import { challengeText, challengeUrl, type ShareResult } from './shareCommon';

export async function shareProblem(problem: Problem): Promise<ShareResult> {
  const url = challengeUrl(problem);
  const text = challengeText(problem);
  if (typeof navigator === 'undefined') return 'failed';
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ text, url });
      return 'shared';
    } catch {
      return 'dismissed';
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return 'copied';
  } catch {
    return 'failed';
  }
}
