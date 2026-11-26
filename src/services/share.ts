import { Share } from 'react-native';
import type { Problem } from '../engine';
import { challengeText, challengeUrl, type ShareResult } from './shareCommon';

export async function shareProblem(problem: Problem): Promise<ShareResult> {
  try {
    const res = await Share.share({ message: `${challengeText(problem)} ${challengeUrl(problem)}` });
    return res.action === Share.dismissedAction ? 'dismissed' : 'shared';
  } catch {
    return 'failed';
  }
}
