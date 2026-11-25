// Keyword landing pages (SEO targets in comments). Practice sets come from the engine; copy is original.
import { Difficulty, ExamId, QuestionStyle } from '../../src/engine';
import type { Faq } from './html/layout';

export interface LandingSection {
  h: string;
  p?: string[];
  list?: string[];
  links?: { label: string; href: string }[];
}

export interface Landing {
  slug: string;
  exam: ExamId;
  title: string;
  description: string;
  h1: string;
  lead: string;
  card: string;
  crumb: string;
  set?: { difficulty?: Difficulty[]; style?: QuestionStyle; coreSeed: number; coreTitle: string; dailyTitle: string };
  guideFirst?: boolean;
  topicIds?: string[];
  sections: LandingSection[];
  faqs: Faq[];
}

const EDEXCEL_URL = 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/mathematics-2017.html';
const AQA_URL = 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes';
const AQA_SPEC_URL = 'https://www.aqa.org.uk/subjects/mathematics/a-level/mathematics-7357';
const OCR_A_URL = 'https://www.ocr.org.uk/qualifications/as-and-a-level/mathematics-a-h230-h240-from-2017/';
const OCR_MEI_URL = 'https://www.ocr.org.uk/qualifications/as-and-a-level/mathematics-b-mei-h630-h640-from-2017/';
const AP_FRQ_URL = 'https://apcentral.collegeboard.org/courses/ap-calculus-ab/exam/past-exam-questions';

const PURE = ['al-proof', 'al-algebra', 'al-coordinate-geometry', 'al-sequences', 'al-trigonometry', 'al-exponentials-logs', 'al-exponential-modelling', 'al-differentiation', 'al-integration', 'al-vectors'];
const APPLIED = ['al-statistics', 'al-mechanics'];

const BOARD_SHARED: LandingSection = {
  h: 'How to use these questions alongside past papers',
  list: [
    'Start with one topic at a time on its topic page until the method feels routine.',
    'Then do a mixed set here, on paper, without notes.',
    'Once a topic is solid, sit a full past paper from your board under timed conditions and mark it with the official mark scheme.',
    'Bring every lost mark back to the matching topic page and drill that skill again.',
  ],
};

export const LANDINGS: Landing[] = [
  // "sat math questions", "sat math questions practice", "example sat math questions", "how many sat math questions"
  {
    slug: 'sat-math-questions',
    exam: 'sat',
    title: 'SAT Math Questions: Free Practice Questions With Answers | CalmExam SAT Math',
    description:
      'Free SAT Math practice questions with verified answers and worked steps. Example questions from all 4 Digital SAT Math domains, plus how many questions are on the test.',
    h1: 'SAT Math questions with answers',
    lead: 'Example SAT Math questions from every content domain, each with a verified answer, worked steps and the slip that catches most students. Fifteen questions stay on this page; ten more change daily.',
    card: 'Example questions from all four Digital SAT Math domains, with answers.',
    crumb: 'SAT Math questions',
    set: { coreSeed: 3101, coreTitle: 'SAT Math practice questions: 15 examples', dailyTitle: "Today's extra SAT Math questions" },
    sections: [
      {
        h: 'How many questions are on SAT Math?',
        p: [
          'The Digital SAT Math section has 44 questions split into two modules of 22. You get 35 minutes for each module, 70 minutes in total. The test is adaptive: how you do on the first module decides whether the second module is easier or harder.',
          'About three quarters of the questions are multiple choice with four options. The rest are student-produced responses, where you type your own answer. A calculator is allowed on every question, and the Desmos graphing calculator is built into the test app.',
        ],
      },
      {
        h: 'What SAT Math questions cover',
        p: ['The College Board groups SAT Math questions into four content domains. Roughly:'],
        list: [
          'Algebra (about 35%): linear equations, linear functions, systems of equations and linear inequalities.',
          'Advanced Math (about 35%): quadratics, nonlinear functions, exponential models and equivalent expressions.',
          'Problem-Solving and Data Analysis (about 15%): ratios, rates, percentages, probability and reading data.',
          'Geometry and Trigonometry (about 15%): area and volume, right triangles, trigonometry and circles.',
        ],
      },
      {
        h: 'How to practise SAT Math questions',
        list: [
          'Do the 15 example questions above without notes and count how many you get right first time.',
          'Open the steps for every miss and find the exact line where your working went wrong.',
          'Move to the topic page for anything you missed twice, then come back and retry the examples.',
          'For a tougher set, try the hard SAT Math questions; to warm up, start with the easy ones.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How many questions are on the SAT Math section?',
        a: 'There are 44 questions in two modules of 22, with 35 minutes per module. Most are multiple choice; about a quarter ask you to type your own answer.',
      },
      {
        q: 'Are these real SAT Math questions?',
        a: 'No. They are original questions written to match the skills and style of the Digital SAT. For official questions, use the free full-length practice tests in the College Board’s Bluebook app.',
      },
      {
        q: 'Where can I find more example SAT Math questions?',
        a: 'Each of the 16 SAT Math topic pages has 15 core questions plus a daily set, and the New set button generates as many more as you want. The SAT Math practice test page mixes every topic.',
      },
      {
        q: 'What is a good SAT Math score?',
        a: 'Section scores run from 200 to 800. What counts as good depends on your goals: check the middle 50% range published by the colleges you are applying to and aim for the top of that range.',
      },
    ],
  },
  // "sat math questions hard", "hard sat math questions"
  {
    slug: 'hard-sat-math-questions',
    exam: 'sat',
    title: 'Hard SAT Math Questions: Free Practice With Worked Solutions | CalmExam SAT Math',
    description:
      'Hard SAT Math questions for students aiming for a 700+ score: stretch-level algebra, advanced math, data and geometry questions with verified answers and steps.',
    h1: 'Hard SAT Math questions',
    lead: 'Stretch-level SAT Math questions, the kind that show up in the harder second module. Every question has a verified answer and full worked steps, so a miss turns into a lesson rather than a guess.',
    card: 'Stretch-level questions for the harder second module, with worked solutions.',
    crumb: 'Hard SAT Math questions',
    set: { difficulty: [3], coreSeed: 3202, coreTitle: '15 hard SAT Math questions', dailyTitle: "Today's hard SAT Math questions" },
    sections: [
      {
        h: 'What makes an SAT Math question hard',
        p: [
          'Hard SAT Math questions rarely need new maths. They hide a familiar skill behind an extra step: a system with a parameter, a quadratic you have to rewrite before you can read the vertex, a percent change applied twice, or a word problem where you must decide what the variable means.',
          'On the Digital SAT, doing well on the first module routes you to a harder second module. That is where these questions live, and they are worth the same as any other question.',
        ],
      },
      {
        h: 'Strategies for hard questions',
        list: [
          'Write down what the question actually asks for. Many hard questions ask for an expression such as 2x + 3, not x.',
          'Translate the words into an equation before touching the numbers.',
          'Use Desmos to check: graph both sides, or graph a system and read the intersection.',
          'Plug a choice back in when the algebra gets long. A wrong choice usually fails fast.',
          'If you are stuck after a minute, mark it, move on and come back. Every question carries the same weight.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are hard SAT Math questions worth more points?',
        a: 'No single question is worth more than another. But reaching the harder second module is what makes the top of the 200 to 800 scale possible, so accuracy on hard questions matters for a 700+ score.',
      },
      {
        q: 'What topics do the hardest SAT Math questions come from?',
        a: 'Most come from Advanced Math and Algebra: quadratics, systems with no or infinitely many solutions, nonlinear functions and exponential models. Hard geometry questions usually combine circles or triangles with algebra.',
      },
      {
        q: 'How should I practise hard SAT Math questions?',
        a: 'Do them untimed first and read the steps for every miss, then retry the same 15 core questions a few days later. Speed comes after the method is reliable.',
      },
    ],
  },
  // "easy sat math questions"
  {
    slug: 'easy-sat-math-questions',
    exam: 'sat',
    title: 'Easy SAT Math Questions: Warm-Up Practice With Answers | CalmExam SAT Math',
    description:
      'Easy SAT Math questions to build confidence: warm-up linear equations, percentages, ratios, geometry and data questions, each with a verified answer and steps.',
    h1: 'Easy SAT Math questions',
    lead: 'Warm-up SAT Math questions that build speed and confidence. These are the points you should never drop on test day, so it pays to make them automatic.',
    card: 'Warm-up questions to build speed and confidence before harder sets.',
    crumb: 'Easy SAT Math questions',
    set: { difficulty: [1], coreSeed: 3303, coreTitle: '15 easy SAT Math questions', dailyTitle: "Today's easy SAT Math questions" },
    sections: [
      {
        h: 'Why easy questions matter',
        p: [
          'Every SAT Math question is worth the same, and the first module decides how hard your second module is. Careless slips on easy questions cost more than they seem, because they can keep you in the easier second module.',
          'The aim with easy questions is speed with zero mistakes, so you bank time for the harder ones.',
        ],
      },
      {
        h: 'How to use this page',
        list: [
          'Do all 15 questions in one sitting and time yourself.',
          'Aim for every question right, in about a minute each.',
          'Any miss here is a pattern worth fixing: open the steps and the pitfalls.',
          'When this set feels easy, move on to the SAT Math practice test, then the hard questions.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are there easy questions on the SAT Math section?',
        a: 'Yes. Each module mixes easier, medium and harder questions. Easier ones tend to be direct: solve a linear equation, find a percent, read a value from a table.',
      },
      {
        q: 'Should I skip easy questions to save time?',
        a: 'No. Easy questions are the fastest points available. Answer them carefully, then spend the time you save on the harder ones.',
      },
      {
        q: 'What should I practise after easy SAT Math questions?',
        a: 'Move on to the mixed SAT Math practice test, then the hard SAT Math questions. If one topic keeps tripping you up, drill it on its topic page.',
      },
    ],
  },
  // "desmos sat", "desmos sat calculator", "desmos sat tricks", "desmos sat math", "how to use desmos on the sat"
  {
    slug: 'desmos-sat-math',
    exam: 'sat',
    title: 'Desmos SAT Calculator: How to Use It, 6 Tricks and Practice | CalmExam SAT Math',
    description:
      'How to use the Desmos SAT calculator built into the Digital SAT: 6 tricks for equations, systems, quadratics, sliders and regression, when not to use it, and free questions to practise on.',
    h1: 'The Desmos SAT calculator: how to use it',
    lead: 'The Digital SAT has the Desmos graphing calculator built in for the whole Math section. Used well, it turns long algebra into a quick check. Here are six Desmos SAT tricks, when not to use it, and questions to practise on.',
    card: 'Six Desmos SAT calculator tricks to solve and check questions faster.',
    crumb: 'Desmos SAT calculator',
    guideFirst: true,
    set: { difficulty: [2, 3], coreSeed: 3404, coreTitle: 'Practise with Desmos: 15 SAT Math questions', dailyTitle: "Today's extra questions to try with Desmos" },
    sections: [
      {
        h: 'Where Desmos is on the SAT',
        p: [
          'In the Bluebook test app, the calculator button opens a Desmos graphing calculator that you can use on every Math question. You can also bring your own approved calculator, but the built-in one is the same tool you can practise with for free on the Desmos website.',
          'Practise with it before test day. Knowing three or four moves well is worth more than knowing every feature.',
        ],
      },
      {
        h: 'Six Desmos SAT tricks that save time',
        list: [
          'Solve an equation by graphing both sides. Type the left side as y = … and the right side as y = …, then click the intersection. The x-coordinate is the solution.',
          'Solve a system of equations. Type both equations exactly as given (Desmos accepts forms like 3x + 2y = 12) and click where the lines cross.',
          'Read a quadratic. Type the equation and click the graph: Desmos marks the vertex, the zeros and the y-intercept.',
          'Use a slider for an unknown constant. Type an equation with a letter such as k and add the slider. Drag it to see which value makes the graphs touch, cross or never meet.',
          'Check a choice. Graph your answer, or type the expression with the answer substituted, to confirm it before you move on.',
          'Fit a line to data. Put the points in a table (x₁ and y₁ columns), then type y₁ ~ mx₁ + b. Desmos gives the line of best fit with m and b, which answers most scatterplot and model questions.',
        ],
      },
      {
        h: 'When not to use Desmos',
        p: [
          'Some questions are faster by hand: a one-step percent, a simple ratio or reading a value from a table. Others ask for an exact form, such as a fraction or a radical, that a decimal on the graph will not show directly. If you know the algebra in one or two lines, do the algebra and use Desmos to check.',
        ],
      },
      {
        h: 'Questions to try with Desmos',
        p: ['The questions on this page are core and stretch level, and many of them, such as systems, quadratics, inequalities and nonlinear functions, can be solved or checked by graphing. Solve each one, then confirm it in Desmos.'],
      },
    ],
    faqs: [
      {
        q: 'Can you use Desmos on the whole SAT Math section?',
        a: 'Yes. On the Digital SAT a calculator is allowed on every Math question, and the Desmos graphing calculator is built into the Bluebook app.',
      },
      {
        q: 'Where do you find the Desmos SAT calculator?',
        a: 'In the Bluebook test app, click the Calculator button at the top of any Math question. To practise before test day, use the free Desmos graphing calculator online or the practice tests in Bluebook.',
      },
      {
        q: 'Is Desmos on the SAT the same as the free Desmos website?',
        a: 'It is the same graphing calculator, so practising on the free Desmos site builds the right habits. Some features can differ slightly in the test app, so also try it in Bluebook’s practice tests.',
      },
      {
        q: 'Which SAT Math questions are easiest to solve with Desmos?',
        a: 'Systems of equations, quadratics (vertex and zeros), equations with a variable on both sides, inequalities and questions about where two graphs meet. Questions that need an exact fraction or radical still need some algebra.',
      },
    ],
  },
  // "ap calc ab frq", "ap calc ab frq 2026"
  {
    slug: 'ap-calc-ab-frq',
    exam: 'ap-calc-ab',
    title: 'AP Calc AB FRQ Practice: Free-Response Style Questions | CalmExam Math Practice',
    description:
      'Free AP Calculus AB FRQ practice: rate and accumulation, particle motion and table-based free-response style questions with verified answers and full working.',
    h1: 'AP Calc AB FRQ practice',
    lead: 'Free-response style AP Calculus AB questions on the three formats that appear almost every year: rates and accumulation, particle motion and table data. Work each one on paper first, then check it against the verified answer and steps.',
    card: 'Free-response style rate, motion and table questions, with full working.',
    crumb: 'AP Calc AB FRQ',
    set: { style: 'frq', coreSeed: 3505, coreTitle: '15 AP Calc AB free-response style questions', dailyTitle: "Today's extra FRQ-style questions" },
    topicIds: ['calc-contextual', 'calc-integration-applications', 'calc-differential-equations', 'calc-integrals'],
    sections: [
      {
        h: 'How the AP Calculus AB free-response section works',
        p: [
          'Section II of the AP Calculus AB exam has 6 free-response questions in 90 minutes and is worth half of your score. Part A has 2 questions in 30 minutes with a graphing calculator. Part B has 4 questions in 60 minutes without one.',
          'Each question has several parts and is marked out of 9 points. Points come from the setup and the reasoning, not only the final number, so the working you write matters as much as the answer.',
        ],
      },
      {
        h: 'The FRQ formats you will see',
        list: [
          'Rate and accumulation: water, people or sand flowing in and out at given rates. You integrate a rate to find an amount, and compare rates to decide if the amount is increasing.',
          'Particle motion: velocity and position. You find displacement, total distance, when the particle changes direction and whether it is speeding up.',
          'Table data: values of a function at uneven times. You estimate with Riemann or trapezoidal sums and average rates of change, and justify with the Mean Value Theorem.',
          'Also common: graphs of f′, area and volume, and differential equations with slope fields.',
        ],
      },
      {
        h: 'How to practise AP Calc AB FRQs',
        list: [
          'Write each answer as if a grader will read it: the integral with its limits, then the value with units.',
          'Justify answers in words, for example "because v(t) changes from positive to negative at t = 3".',
          'Do the 15 core questions above on paper, then check them against the verified working.',
          'Finish with released questions from past exams for full timed practice.',
        ],
        links: [{ label: 'Past AP Calculus AB free-response questions (College Board)', href: AP_FRQ_URL }],
      },
    ],
    faqs: [
      {
        q: 'How many FRQs are on the AP Calculus AB exam?',
        a: 'There are 6 free-response questions in 90 minutes: 2 with a calculator in Part A and 4 without one in Part B. Together they make up 50% of the exam score.',
      },
      {
        q: 'Where can I find the 2026 AP Calc AB FRQs?',
        a: 'The College Board usually posts each year’s free-response questions, with scoring guidelines, on AP Central after the exam. Use them for timed practice once the formats on this page feel familiar.',
      },
      {
        q: 'Why are these FRQ-style questions multiple choice?',
        a: 'So you can check your answer instantly on any device. Treat the choices as a self-check: write the full solution on paper first, then compare it with the verified steps.',
      },
      {
        q: 'What is the most common AP Calc AB FRQ mistake?',
        a: 'Missing justification and units. A correct number with no reasoning, such as no sign analysis for a change of direction, often earns only part of the points.',
      },
    ],
  },
  // "ap calculus ab practice questions", "ap calculus ab practice mcq"
  {
    slug: 'ap-calculus-ab-practice-questions',
    exam: 'ap-calc-ab',
    title: 'AP Calculus AB Practice Questions (MCQ) With Answers | CalmExam Math Practice',
    description:
      'Free AP Calculus AB practice questions in multiple-choice format, across all 8 units, with verified answers, worked steps and the common mistakes for each question.',
    h1: 'AP Calculus AB practice questions',
    lead: 'Multiple-choice AP Calculus AB practice questions across every unit, from limits to differential equations. Fifteen stay on this page so you can retry them; ten more change every day.',
    card: 'Multiple-choice questions across all 8 units, with verified answers.',
    crumb: 'AP Calculus AB practice questions',
    set: { style: 'mcq', coreSeed: 3606, coreTitle: '15 AP Calculus AB practice questions', dailyTitle: "Today's extra AP Calculus AB questions" },
    sections: [
      {
        h: 'The AP Calculus AB multiple-choice section',
        p: [
          'Section I has 45 multiple-choice questions in 1 hour 45 minutes and is worth half of your score. Part A has 30 questions in 60 minutes without a calculator. Part B has 15 questions in 45 minutes with a graphing calculator.',
          'Multiple-choice questions reward fast, accurate technique: clean derivatives and integrals, reading graphs and tables, and spotting which rule applies.',
        ],
      },
      {
        h: 'What the questions cover',
        list: [
          'Limits and continuity',
          'Differentiation: definition and basic rules, then composite, implicit and inverse functions',
          'Contextual applications of differentiation, such as related rates and motion',
          'Analytical applications of differentiation, such as extrema and concavity',
          'Integration and accumulation of change',
          'Differential equations',
          'Applications of integration, such as area and volume',
        ],
      },
    ],
    faqs: [
      {
        q: 'How many multiple-choice questions are on AP Calculus AB?',
        a: 'There are 45 questions in 1 hour 45 minutes: 30 without a calculator and 15 with one. The multiple-choice section is worth 50% of the score.',
      },
      {
        q: 'Do these questions cover all AP Calculus AB units?',
        a: 'Yes. There are topic pages for limits, derivatives, implicit and composite differentiation, related rates and motion, applications of derivatives, integrals, area and volume, and differential equations.',
      },
      {
        q: 'Should I guess on AP Calculus multiple choice?',
        a: 'Yes. There is no penalty for wrong answers, so never leave a question blank. Rule out the choices you can, then pick from what is left.',
      },
    ],
  },
  // "a level maths past papers edexcel", "edexcel a level maths practice questions"
  {
    slug: 'edexcel-a-level-maths-practice-questions',
    exam: 'a-level',
    title: 'Edexcel A Level Maths Practice Questions by Topic | CalmExam Math Practice',
    description:
      'Edexcel A Level Maths (9MA0) practice questions by topic for Pure 1, Pure 2 and Statistics and Mechanics, with worked solutions and links to the official past papers.',
    h1: 'Edexcel A Level Maths practice questions',
    lead: 'Past-paper-style practice for Edexcel A Level Maths (9MA0), sorted by topic and paper. Every question has a verified answer and a worked solution. For the real papers, use the links to Pearson below.',
    card: 'Practice by topic for Pure 1, Pure 2 and Statistics and Mechanics.',
    crumb: 'Edexcel A Level Maths',
    set: { coreSeed: 3707, coreTitle: '15 Edexcel-style A Level Maths questions', dailyTitle: "Today's extra A Level Maths questions" },
    topicIds: [...PURE, ...APPLIED],
    sections: [
      {
        h: 'Edexcel A Level Maths papers',
        list: [
          'Paper 1: Pure Mathematics 1 (2 hours, 100 marks).',
          'Paper 2: Pure Mathematics 2 (2 hours, 100 marks).',
          'Paper 3: Statistics and Mechanics (2 hours, 100 marks). Section A is statistics and Section B is mechanics, 50 marks each.',
        ],
        p: ['Each paper is a third of the A Level. Pure topics can appear on either pure paper, so practise all of them for both.'],
      },
      {
        h: 'Edexcel A Level Maths past papers',
        p: [
          'Pearson publishes past papers and mark schemes for 9MA0 on its qualification page. We do not host those papers. Use them for full timed practice once the topic questions here feel routine.',
        ],
        links: [{ label: 'Edexcel A Level Mathematics past papers and specification (Pearson)', href: EDEXCEL_URL }],
      },
      BOARD_SHARED,
    ],
    faqs: [
      {
        q: 'Are these Edexcel past paper questions?',
        a: 'No. They are original questions in the style of the Edexcel papers, each generated with its own worked solution. Past papers and mark schemes are on Pearson’s website.',
      },
      {
        q: 'Which topics are on Edexcel Paper 3?',
        a: 'Paper 3 covers statistics (sampling, data, probability, the binomial and normal distributions and hypothesis testing) and mechanics (kinematics, forces, Newton’s laws and moments).',
      },
      {
        q: 'Do I need a calculator for Edexcel A Level Maths?',
        a: 'Yes. A calculator is allowed on all three papers. Check the board’s rules for which models are permitted.',
      },
    ],
  },
  // "aqa a level maths past papers", "aqa a level maths practice questions"
  {
    slug: 'aqa-a-level-maths-practice-questions',
    exam: 'a-level',
    title: 'AQA A Level Maths Practice Questions by Topic | CalmExam Math Practice',
    description:
      'AQA A Level Maths (7357) practice questions by topic for Papers 1, 2 and 3: pure, mechanics and statistics, with worked solutions and links to the AQA past papers.',
    h1: 'AQA A Level Maths practice questions',
    lead: 'Past-paper-style practice for AQA A Level Maths (7357), sorted by topic and paper, with a verified answer and worked solution for every question. For the real papers, use the AQA links below.',
    card: 'Practice by topic for AQA Papers 1, 2 and 3.',
    crumb: 'AQA A Level Maths',
    set: { coreSeed: 3808, coreTitle: '15 AQA-style A Level Maths questions', dailyTitle: "Today's extra A Level Maths questions" },
    topicIds: [...PURE, ...APPLIED],
    sections: [
      {
        h: 'AQA A Level Maths papers',
        list: [
          'Paper 1: pure mathematics (2 hours, 100 marks).',
          'Paper 2: pure mathematics and mechanics (2 hours, 100 marks).',
          'Paper 3: pure mathematics and statistics (2 hours, 100 marks).',
        ],
        p: ['Each paper is a third of the A Level, and pure maths can appear on all three, so keep pure topics fresh right up to Paper 3.'],
      },
      {
        h: 'AQA A Level Maths past papers',
        p: ['AQA publishes past papers, mark schemes and examiner reports on its website. We do not host those papers. Examiner reports are especially useful: they list the mistakes that cost students the most marks.'],
        links: [
          { label: 'AQA past papers and mark schemes', href: AQA_URL },
          { label: 'AQA A Level Mathematics (7357) specification', href: AQA_SPEC_URL },
        ],
      },
      BOARD_SHARED,
    ],
    faqs: [
      {
        q: 'Are these AQA past paper questions?',
        a: 'No. They are original questions in the style of AQA A Level Maths, each with its own worked solution. Past papers, mark schemes and examiner reports are on AQA’s website.',
      },
      {
        q: 'Where is mechanics on AQA A Level Maths?',
        a: 'Mechanics is in Section B of Paper 2, after the pure maths in Section A. Statistics is in Section B of Paper 3.',
      },
      {
        q: 'Do AQA papers give formulae?',
        a: 'AQA provides a formulae and statistical tables booklet in the exam. Many core results, such as the quadratic formula and the laws of logarithms, are not in it, so learn those.',
      },
    ],
  },
  // "ocr a level maths past papers", "ocr mei a level maths past papers"
  {
    slug: 'ocr-a-level-maths-practice-questions',
    exam: 'a-level',
    title: 'OCR A Level Maths Practice Questions (OCR A and MEI) | CalmExam Math Practice',
    description:
      'OCR A Level Maths practice questions by topic for OCR A (H240) and OCR MEI (H640): pure, statistics and mechanics, with worked solutions and official past paper links.',
    h1: 'OCR A Level Maths practice questions',
    lead: 'Past-paper-style practice for OCR A Level Maths A (H240) and Maths B MEI (H640), sorted by topic, with a verified answer and worked solution for every question. For the real papers, use the OCR links below.',
    card: 'Practice by topic for OCR A (H240) and OCR MEI (H640).',
    crumb: 'OCR A Level Maths',
    set: { coreSeed: 3909, coreTitle: '15 OCR-style A Level Maths questions', dailyTitle: "Today's extra A Level Maths questions" },
    topicIds: [...PURE, ...APPLIED],
    sections: [
      {
        h: 'OCR A Level Maths A (H240) papers',
        list: [
          'Paper 1: Pure Mathematics (2 hours, 100 marks).',
          'Paper 2: Pure Mathematics and Statistics (2 hours, 100 marks).',
          'Paper 3: Pure Mathematics and Mechanics (2 hours, 100 marks).',
        ],
      },
      {
        h: 'OCR A Level Maths B MEI (H640) papers',
        list: [
          'Paper 1: Pure Mathematics and Mechanics (2 hours, 100 marks).',
          'Paper 2: Pure Mathematics and Statistics (2 hours, 100 marks).',
          'Paper 3: Pure Mathematics and Comprehension (2 hours, 75 marks), which includes questions on an article printed in an insert with the paper.',
        ],
        p: ['Both OCR specifications share the same core content as the other boards, so every question on this page suits OCR A and OCR MEI.'],
      },
      {
        h: 'OCR A Level Maths past papers',
        p: ['OCR publishes past papers and mark schemes on each qualification page. We do not host those papers.'],
        links: [
          { label: 'OCR A Level Mathematics A (H240) past papers', href: OCR_A_URL },
          { label: 'OCR A Level Mathematics B MEI (H640) past papers', href: OCR_MEI_URL },
        ],
      },
      BOARD_SHARED,
    ],
    faqs: [
      {
        q: 'What is the difference between OCR A and OCR MEI A Level Maths?',
        a: 'Both cover the same core content. They differ in how papers are organised: OCR MEI pairs mechanics with pure on Paper 1 and has a comprehension paper based on an article given with the exam.',
      },
      {
        q: 'Are these OCR past paper questions?',
        a: 'No. They are original questions in the style of OCR A Level Maths, each with its own worked solution. Past papers and mark schemes are on OCR’s website.',
      },
      {
        q: 'How should I prepare for the OCR MEI comprehension paper?',
        a: 'Keep your pure maths sharp, since most of Paper 3 is pure. For the comprehension section, practise with past comprehension tasks so you are used to reading a new mathematical article and answering questions on it under time pressure.',
      },
    ],
  },
];

export function findLanding(path: string): Landing | undefined {
  return LANDINGS.find((l) => '/' + l.slug === path);
}
