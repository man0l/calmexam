// Original page copy for hubs and topic pages (SEO targets in comments).
import { ExamId } from '../../src/engine';
import type { Faq } from './html/layout';

export interface HubCopy {
  title: string; // <title>
  description: string; // meta description
  h1: string;
  lead: string;
  level: string;
  practiceTitle: string;
  about: { h: string; p: string[] };
  facts: { k: string; v: string }[];
  howTo: string[];
  faqs: Faq[];
  topicNoun: string; // "practice problems" | "practice questions"
}

export const HUB_COPY: Record<ExamId, HubCopy> = {
  // "sat math practice test", "sat math exam practice test", "online sat math practice"
  sat: {
    title: 'SAT Math Practice Test: Free Online Questions With Verified Answers | CalmExam',
    description:
      'Free online SAT Math practice test with 10 fresh questions every day. Check your answer instantly and see the verified answer, step-by-step solution and common pitfalls.',
    h1: 'SAT Math practice test',
    lead: 'Ten fresh SAT Math questions, generated today. Pick an answer to check it instantly, then see the verified answer, the steps and the traps that catch most students. Stuck? Tap "Explain my mistake".',
    level: 'High school',
    practiceTitle: "Today's SAT Math practice set",
    about: {
      h: 'How this SAT Math practice works',
      p: [
        'Every question on this page comes from a generator that builds the problem and its answer together, so the answer key is computed, not typed in by hand. That is why we can call each answer "verified": the numbers in the question, the four choices and the worked steps all come from the same source.',
        'The set changes every day and covers the algebra, advanced math, problem-solving and geometry skills the Digital SAT tests most often: linear equations and functions, systems, quadratics, percentages, exponential growth, circles, right triangles and statistics. Want more? Press "New set" for another ten.',
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
        a: 'Yes. The practice sets on calmexam.com are free and need no account. You get 10 new SAT Math questions each day and can generate more with the New set button.',
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
        q: 'Can I use a calculator?',
        a: 'Yes. On the Digital SAT a calculator is allowed for the whole Math section, and so it is here. Many questions are still faster with algebra, so the steps show the quickest route.',
      },
    ],
    topicNoun: 'practice problems',
  },
  // "ap calculus practice test(s)", "ap calculus practice problems"
  'ap-calc-ab': {
    title: 'AP Calculus AB Practice Test: Free Questions With Step-by-Step Answers | CalmExam',
    description:
      'Free AP Calculus AB practice test: 10 new multiple-choice questions daily on limits, derivatives, applications and integrals, each with a verified answer and worked steps.',
    h1: 'AP Calculus practice test',
    lead: 'Ten AP Calculus AB questions, freshly generated today. Check each answer instantly and study the verified solution, step by step, with the pitfalls graders see most.',
    level: 'High school (AP)',
    practiceTitle: "Today's AP Calculus AB practice set",
    about: {
      h: 'How this AP Calculus practice works',
      p: [
        'Each question is generated together with its answer and full working, so every answer is verified by construction. The set covers the four big ideas of Calculus AB: limits, derivative rules, applications of derivatives and integrals, including the Fundamental Theorem of Calculus.',
        'Use these as warm-ups for the multiple-choice section, and as a quick check that you can still differentiate and integrate cleanly under time pressure. A new set is generated every day, and "New set" gives you more any time.',
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
        a: 'Yes. All practice sets on calmexam.com are free and need no sign-up. You get 10 new AP Calculus AB questions daily plus unlimited extra sets.',
      },
      {
        q: 'Are these official AP Calculus questions?',
        a: 'No. They are original questions written for the AP Calculus AB course skills. Released free-response questions from the College Board are a great complement for exam-style written practice.',
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
    title: 'A-Level Maths Practice Questions With Worked Solutions (Free) | CalmExam',
    description:
      'Free A-Level Maths practice questions on algebra, calculus, logs, sequences, trigonometry, coordinate geometry and mechanics. Verified answers with worked solutions.',
    h1: 'A-Level Maths practice questions',
    lead: 'Ten A-Level Maths questions, generated fresh today, covering pure maths and mechanics. Choose an answer to check it, then work through the verified solution and the usual pitfalls.',
    level: 'A-Level (UK, Year 12–13)',
    practiceTitle: "Today's A-Level Maths practice questions",
    about: {
      h: 'How these A-Level Maths questions work',
      p: [
        'Each question is built by a generator that works out the answer and the worked solution from the same values it puts in the question, so the mark scheme is always consistent with the question. Topics follow the shared core content used by the main UK exam boards: algebra, differentiation, integration, exponentials and logarithms, sequences and series, trigonometry, coordinate geometry and SUVAT mechanics.',
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
        a: 'Yes. They are free with no sign-up. There are 10 new questions each day and you can generate as many extra sets as you like.',
      },
      {
        q: 'Which exam board do these questions follow?',
        a: 'They follow the core content shared by the main boards (Edexcel, AQA, OCR). Always check your own board’s specification and past papers for exact wording and mark schemes.',
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

/** Short original guidance per topic (2 sentences + key idea). */
export const TOPIC_TIPS: Record<string, { why: string; key: string }> = {
  'sat-linear-equations': {
    why: 'Linear equations are the backbone of SAT Math: they appear on their own and inside almost every word problem.',
    key: 'Keep both sides balanced: whatever you add, subtract or divide, do it to the whole equation, and watch the sign when a term changes sides.',
  },
  'sat-linear-functions': {
    why: 'Slope and function notation questions reward reading carefully more than heavy computation.',
    key: 'Slope is change in y divided by change in x, in the same order for both points. For f(a), substitute a everywhere x appears.',
  },
  'sat-systems': {
    why: 'Systems of two linear equations show up as pure algebra and as two-condition word problems.',
    key: 'Line up the variables, then add or subtract equations to eliminate one. Check your pair in both original equations.',
  },
  'sat-quadratics': {
    why: 'Quadratics are the core of the SAT’s advanced math questions: roots, factoring and the vertex of a parabola.',
    key: 'Roots have the opposite sign to the numbers in the factors, and the vertex x-coordinate is −b / 2a.',
  },
  'sat-percentages': {
    why: 'Percent questions are quick points if you avoid the classic trap of adding successive percent changes.',
    key: 'Turn each change into a multiplier (a 20% rise is ×1.2, a 20% drop is ×0.8) and multiply them in order.',
  },
  'sat-exponentials': {
    why: 'Exponential models describe growth and decay, and the SAT likes doubling and half-life style questions.',
    key: 'In a·bᵗ, a is the starting value and b is the growth factor per period. Count periods carefully before you raise to a power.',
  },
  'sat-circles': {
    why: 'Circle questions mix coordinate geometry with area and arc reasoning.',
    key: 'In (x − h)² + (y − k)² = r², the centre is (h, k) and the right side is r², not r. A sector is the fraction angle/360 of the full circle.',
  },
  'sat-geometry': {
    why: 'Right triangles appear in geometry and in disguised distance problems.',
    key: 'a² + b² = c² with c the hypotenuse. Spotting triples like 3-4-5 and 5-12-13 saves time.',
  },
  'sat-statistics': {
    why: 'Mean questions are usually about totals: the sum is the key quantity, not the average itself.',
    key: 'Total = mean × count. To find a missing value, compute the needed total and subtract what you already have.',
  },
  'calc-limits': {
    why: 'Limits are the foundation of calculus and a common way to open the AP exam.',
    key: 'If direct substitution gives 0/0, factor and cancel the common factor, then substitute again.',
  },
  'calc-derivatives': {
    why: 'Fast, accurate differentiation is the single most used skill on AP Calculus AB.',
    key: 'Name the rule before you start (power, product, quotient or chain) and never drop the derivative of the inside function.',
  },
  'calc-applications': {
    why: 'Applications turn derivatives into answers about tangent lines, rates and extreme values.',
    key: 'A tangent line needs a point and a slope f′(a). Local extrema happen where f′ changes sign, not just where f′ = 0.',
  },
  'calc-integrals': {
    why: 'Integrals connect accumulation, area and average value through the Fundamental Theorem of Calculus.',
    key: 'Find an antiderivative F, then compute F(b) − F(a) in that order. Average value divides by the interval length b − a.',
  },
  'al-algebra': {
    why: 'Algebra underpins every A-Level paper, from binomial expansions to discriminant conditions.',
    key: 'In a binomial expansion, include the coefficient raised to the power. For real roots, the discriminant b² − 4ac must be at least 0.',
  },
  'al-differentiation': {
    why: 'Finding and classifying stationary points is a guaranteed exam skill.',
    key: 'Set dy/dx = 0 to find stationary points, then use the second derivative (or a sign check) to classify them.',
  },
  'al-integration': {
    why: 'Definite integrals with negative and fractional powers test both technique and care with arithmetic.',
    key: 'Add one to the power and divide by the new power, including for negative powers, then substitute the limits top minus bottom.',
  },
  'al-exponentials-logs': {
    why: 'Logarithms appear across pure maths and in modelling questions.',
    key: 'log a + log b = log ab, log a − log b = log(a/b), and n log a = log aⁿ. Always check solutions are in the domain.',
  },
  'al-sequences': {
    why: 'Arithmetic and geometric series are short, high-value questions on every pure paper.',
    key: 'Arithmetic sum: n/2 (2a + (n − 1)d). A geometric sum to infinity a / (1 − r) exists only when |r| < 1.',
  },
  'al-trigonometry': {
    why: 'Trig equations test whether you can find every solution in an interval, not just the calculator value.',
    key: 'Find the principal value, then use the symmetry of the graph to list every solution in the given range.',
  },
  'al-coordinate-geometry': {
    why: 'Straight lines and circles are core pure maths and often feed into longer questions.',
    key: 'Perpendicular gradients multiply to −1. Complete the square to read a circle’s centre and radius.',
  },
  'al-mechanics': {
    why: 'SUVAT questions are the bread and butter of A-Level mechanics.',
    key: 'List s, u, v, a and t, mark the one you don’t need, and pick the equation without it. Choose a positive direction and stick to it.',
  },
};

export function topicFaqs(examName: string, topicName: string, noun: string): Faq[] {
  return [
    {
      q: `Are these ${examName} ${topicName} ${noun} free?`,
      a: `Yes. There are 10 new ${topicName} questions every day, free and without sign-up, and the New set button generates more whenever you want.`,
    },
    {
      q: `How are the answers verified?`,
      a: 'Each question is generated together with its answer and worked steps from the same numbers, so the answer always matches the question. An AI model is only used to explain mistakes, and it is given the verified answer; it never decides what is correct.',
    },
    {
      q: `What does "Explain my mistake" do?`,
      a: 'After a wrong answer, it sends the question and your choice to our server, which rebuilds the verified solution and asks an AI model to explain, in plain words, where your choice likely went wrong. If the model is unavailable you get an explanation built from the verified steps instead.',
    },
  ];
}
