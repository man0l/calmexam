// Original page copy for hubs and topic pages (SEO targets in comments).
import { ExamId } from '../../src/engine';
import type { Faq } from './html/layout';
export { TOPIC_COPY } from './topic-copy';

export interface HubCopy {
  title: string; // <title>
  description: string; // meta description
  h1: string;
  lead: string;
  level: string;
  coreTitle: string;
  dailyTitle: string;
  about: { h: string; p: string[] };
  facts: { k: string; v: string }[];
  howTo: string[];
  faqs: Faq[];
  topicNoun: string; // "practice problems" | "practice questions"
}

export const HUB_COPY: Record<ExamId, HubCopy> = {
  // "sat math practice test", "sat math exam practice test", "online sat math practice"
  sat: {
    title: 'SAT Math Practice Test: Free Questions & Answers | CalmExam SAT Math',
    description:
      'Free SAT Math practice test: 15 core questions across 16 topics plus 10 new ones daily. Check answers instantly and see verified steps and common pitfalls.',
    h1: 'SAT Math practice test',
    lead: 'Fifteen core SAT Math questions across algebra, advanced math, problem-solving and geometry, plus ten new ones every day. Pick an answer to check it instantly, then see the verified answer, the steps and the traps that catch most students.',
    level: 'High school',
    coreTitle: 'SAT Math practice test: 15 core questions',
    dailyTitle: "Today's SAT Math practice set",
    about: {
      h: 'How this SAT Math practice works',
      p: [
        'Every question on this page comes from a generator that builds the problem and its answer together, so the answer key is computed, not typed in by hand. That is why we can call each answer "verified": the numbers in the question, the four choices and the worked steps all come from the same source.',
        'The core set above stays the same, so you can retry it and track progress. The daily set below it changes every day. Together they cover the skills the Digital SAT tests: linear equations, functions and inequalities, systems, quadratics and nonlinear functions, ratios and percentages, exponential growth, probability and data, circles, triangles, trigonometry, and area and volume. Want more? Press "New set".',
      ],
    },
    facts: [
      { k: 'Format', v: 'Digital SAT Math: 2 adaptive modules, 44 questions, 70 minutes' },
      { k: 'Score', v: '200 to 800 for the Math section' },
      { k: 'Calculator', v: 'Allowed on every question (built-in Desmos)' },
      { k: 'Question types', v: 'Mostly multiple choice, plus some student-produced responses' },
    ],
    howTo: [
      'Do the set without notes first, the way you would on test day.',
      'Read the steps for every miss, even the ones you "almost" had.',
      'Use the pitfalls list: most lost points come from the same few slips.',
      'Drill your weakest topic on its own page until it feels routine.',
    ],
    faqs: [
      {
        q: 'Is this SAT Math practice test free?',
        a: 'Yes. The practice sets on calmexam.com are free and need no account. You get 15 core questions that stay on the page, 10 new SAT Math questions each day, and as many extra sets as you like with the New set button.',
      },
      {
        q: 'Are these real SAT questions?',
        a: 'No. They are original practice questions written to match the skills and style of Digital SAT Math. Official past questions belong to the College Board; use their free Bluebook practice tests alongside CalmExam for full-length timing practice.',
      },
      {
        q: 'How do I know the answers are correct?',
        a: 'Each question is produced by a generator that computes the answer and the steps from the same numbers it puts in the question. Nothing is typed in by hand, so the answer key cannot drift out of sync with the question.',
      },
      {
        q: 'How should I use a practice test to raise my SAT Math score?',
        a: 'Practise a little every day, review every wrong answer with the steps, and spend most of your time on your two or three weakest topics. Short daily sessions beat occasional long ones.',
      },
      {
        q: 'How many questions are on the SAT Math section?',
        a: 'The Digital SAT Math section has 44 questions in two adaptive modules of 22 questions, with 35 minutes per module. Most are multiple choice and about a quarter are student-produced responses where you type the answer.',
      },
      {
        q: 'Can I use a calculator?',
        a: 'Yes. On the Digital SAT a calculator is allowed for the whole Math section, and so it is here. Many questions are still faster with algebra, so the steps show the quickest route.',
      },
    ],
    topicNoun: 'practice problems',
  },
  // "ap calculus practice test(s)", "ap calculus practice problems"
  'ap-calc-ab': {
    title: 'AP Calculus AB Practice Test and Questions (Free) | CalmExam Math Practice',
    description:
      'Free AP Calculus AB practice test: 15 core questions plus 10 new daily, covering all 8 units and FRQ-style questions, each with a verified answer and steps.',
    h1: 'AP Calculus practice test',
    lead: 'Fifteen core AP Calculus AB practice questions, plus ten new ones every day, from limits to differential equations. Check each answer instantly and study the verified solution, step by step, with the pitfalls graders see most.',
    level: 'High school (AP)',
    coreTitle: 'AP Calculus AB practice test: 15 core questions',
    dailyTitle: "Today's AP Calculus AB practice set",
    about: {
      h: 'How this AP Calculus practice works',
      p: [
        'Each question is generated together with its answer and full working, so every answer is verified by construction. The questions cover the Calculus AB course: limits and continuity, derivative rules, implicit and composite differentiation, related rates and motion, applications of derivatives, integrals and the Fundamental Theorem, area and volume, and differential equations.',
        'Use these as warm-ups for the multiple-choice section, and work the free-response-style questions (rates, accumulation, particle motion and tables) on paper first. The core set stays fixed; the daily set below changes every day, and "New set" gives you more any time.',
      ],
    },
    facts: [
      { k: 'Exam length', v: '3 hours 15 minutes' },
      { k: 'Section I', v: '45 multiple-choice questions (calculator and no-calculator parts)' },
      { k: 'Section II', v: '6 free-response questions' },
      { k: 'Score', v: '1 to 5; usually taken in May' },
    ],
    howTo: [
      'Write out each derivative or integral before looking at the choices.',
      'For every miss, find the exact step where your working split from the verified steps.',
      'Watch for the classic slips: chain rule factors, signs, and forgetting to evaluate.',
      'Rotate topics: limits, derivatives, applications, integrals.',
    ],
    faqs: [
      {
        q: 'Is this AP Calculus practice test free?',
        a: 'Yes. All practice sets on calmexam.com are free and need no sign-up. You get 15 core questions, 10 new AP Calculus AB questions daily and unlimited extra sets.',
      },
      {
        q: 'Are these official AP Calculus questions?',
        a: 'No. They are original questions written for the AP Calculus AB course skills. Released free-response questions from the College Board are a great complement for exam-style written practice.',
      },
      {
        q: 'Is there AP Calculus AB free-response (FRQ) practice?',
        a: 'Yes. The AP Calc AB FRQ page has free-response-style questions on rates and accumulation, particle motion and table data. They are multiple choice so you can check them instantly, but work each one on paper first, the way you would on Section II.',
      },
      {
        q: 'Does this cover AP Calculus BC?',
        a: 'The sets target Calculus AB. AB topics are also the first part of BC, so BC students can use them for limits, derivatives and integrals, but series and parametric topics are not covered yet.',
      },
      {
        q: 'Why do the answers come with pitfalls?',
        a: 'Most lost points in calculus come from a handful of repeat slips, such as dropping the inner derivative in the chain rule. Seeing the common pitfall next to the correct steps helps you spot your own pattern.',
      },
    ],
    topicNoun: 'practice problems',
  },
  // "a level maths practice questions"
  'a-level': {
    title: 'A-Level Maths Practice Questions by Topic (Free) | CalmExam Math Practice',
    description:
      'Free A-Level Maths practice questions by topic: pure, statistics and mechanics for Edexcel, AQA and OCR. 15 core questions plus 10 daily, with worked solutions.',
    h1: 'A-Level Maths practice questions',
    lead: 'Fifteen core A-Level Maths questions covering pure maths, statistics and mechanics, plus ten new ones every day. Choose an answer to check it, then work through the verified solution and the usual pitfalls.',
    level: 'A-Level (UK, Year 12–13)',
    coreTitle: 'A-Level Maths practice questions: 15 core questions',
    dailyTitle: "Today's A-Level Maths practice questions",
    about: {
      h: 'How these A-Level Maths questions work',
      p: [
        'Each question is built by a generator that works out the answer and the worked solution from the same values it puts in the question, so the mark scheme is always consistent with the question. Topics follow the shared core content used by the main UK exam boards: algebra, proof, differentiation, integration, exponentials, logarithms and exponential modelling, sequences and series, trigonometry, coordinate geometry, vectors, statistics and SUVAT mechanics.',
        'The real exam is written, not multiple choice, so use the four options as a quick self-check: work it out on paper first, then pick the matching answer and compare your method with the verified steps.',
      ],
    },
    facts: [
      { k: 'Papers', v: 'Usually 3 papers of 2 hours (check your board)' },
      { k: 'Content', v: 'Pure maths, plus statistics and mechanics' },
      { k: 'Grades', v: 'A* to E' },
      { k: 'Boards', v: 'Edexcel, AQA, OCR and others share the core content' },
    ],
    howTo: [
      'Work on paper first, then check against the options.',
      'Compare your method line by line with the worked solution.',
      'Note recurring slips (signs, log laws, limits of integration).',
      'Mix pure and mechanics questions, as the papers do.',
    ],
    faqs: [
      {
        q: 'Are these A-Level Maths practice questions free?',
        a: 'Yes. They are free with no sign-up. There are 15 core questions, 10 new questions each day, and you can generate as many extra sets as you like.',
      },
      {
        q: 'Which exam board do these questions follow?',
        a: 'They follow the core content shared by the main boards (Edexcel, AQA, OCR). Always check your own board’s specification and past papers for exact wording and mark schemes.',
      },
      {
        q: 'Do you have practice questions for my exam board?',
        a: 'Yes. There are separate pages for Edexcel, AQA and OCR (including OCR MEI) that explain each paper and link to the official past papers on the board’s website. The questions themselves cover the shared core content, so they suit every board.',
      },
      {
        q: 'Are these past paper questions?',
        a: 'No. Every question is original and generated with its own worked solution. Past papers from your board are still the best practice for full timed papers.',
      },
      {
        q: 'Why multiple choice when the A-Level exam is written?',
        a: 'Choices let you check your answer instantly on any device. Treat them as a self-check: solve on paper first, then compare your working with the verified steps.',
      },
    ],
    topicNoun: 'practice questions',
  },
};

export const BRAND = 'CalmExam Math Practice';

/** Content last changed (sitemap lastmod). Bump when page copy or the question bank changes. */
export const CONTENT_UPDATED = '2026-11-25';

export function topicFaqs(examName: string, topicName: string, noun: string, specific: Faq[] = []): Faq[] {
  return [
    ...specific,
    {
      q: `Are these ${examName} ${topicName} ${noun} free?`,
      a: `Yes. The 15 core questions on this page stay the same so you can come back to them, and the daily set below changes every day. Both are free with no sign-up, and New set generates more whenever you want.`,
    },
    {
      q: `How are the ${topicName} answers verified?`,
      a: 'Each question is generated together with its answer and worked steps from the same numbers, so the answer always matches the question. An AI model is only used to explain mistakes, and it is given the verified answer; it never decides what is correct.',
    },
  ];
}
