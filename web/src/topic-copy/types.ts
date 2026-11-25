import type { Faq } from '../html/layout';

export interface TopicCopy {
  why: string;
  key: string;
  mistakes: string[];
  examTip: string;
  faqs: Faq[];
}
