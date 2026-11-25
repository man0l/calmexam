import { ALEVEL_EXTRA_COPY } from './alevel-extra';
import { ALEVEL_NEW_COPY } from './alevel-new';
import { CALC_EXTRA_COPY } from './calc-extra';
import { CALC_NEW_COPY } from './calc-new';
import { SAT_EXTRA_COPY } from './sat-extra';
import { SAT_NEW_COPY } from './sat-new';
import type { TopicCopy } from './types';

export type { TopicCopy } from './types';

export const TOPIC_COPY: Record<string, TopicCopy> = {
  ...SAT_EXTRA_COPY,
  ...SAT_NEW_COPY,
  ...CALC_EXTRA_COPY,
  ...CALC_NEW_COPY,
  ...ALEVEL_EXTRA_COPY,
  ...ALEVEL_NEW_COPY,
};
