import type { TopicCopy } from './types';

export const ALEVEL_NEW_COPY: Record<string, TopicCopy> = {
  'al-vectors': {
    why: 'Vectors are part of A-Level Maths pure content and support mechanics, where forces and velocities are vectors. Questions test magnitude, direction, position vectors and parallel vectors, often as short opening parts.',
    key: 'For a = xi + yj + zk, |a| = √(x² + y² + z²), and AB→ = b − a. A unit vector in the direction of a is a ÷ |a|, and parallel vectors are scalar multiples of each other.',
    mistakes: [
      'Finding AB→ as a − b instead of b − a.',
      'Adding the components instead of squaring them when finding a magnitude.',
      'Using tan⁻¹ for a direction and giving the acute angle when a component is negative.',
    ],
    examTip: 'Sketch the vector roughly before finding an angle. The sketch shows which quadrant it lies in, so you can check that your angle is sensible.',
    faqs: [
      {
        q: 'How do I find the vector from A to B?',
        a: 'Subtract the position vectors: AB→ = b − a, which is "end minus start". The vector BA→ is then −AB→.',
      },
      {
        q: 'How do I show two vectors are parallel?',
        a: 'Show that one is a scalar multiple of the other, so b = λa for some number λ. Find λ from one pair of components and check that it works for the others.',
      },
      {
        q: 'How do I find the angle a vector makes with i?',
        a: 'Use cos θ = (i component) ÷ magnitude. This gives an angle between 0° and 180° and handles negative components correctly. Make sure your calculator is in degree mode.',
      },
    ],
  },
  'al-statistics': {
    why: 'Statistics is a large part of the applied content in A-Level Maths. The binomial and normal distributions and hypothesis tests are regular topics, and their method marks are very achievable.',
    key: 'For X ~ B(n, p), P(X = r) = C(n, r) × pʳ × (1 − p)ⁿ⁻ʳ, E(X) = np and Var(X) = np(1 − p). For X ~ N(μ, σ²), standardise with z = (x − μ)/σ.',
    mistakes: [
      'Leaving out C(n, r) when finding a binomial probability.',
      'Using the variance in place of the standard deviation in N(μ, σ²).',
      'Using P(X = x) instead of the tail probability in a hypothesis test.',
    ],
    examTip: 'In a hypothesis test, state H₀ and H₁ in terms of p, give the probability or critical region, then write the conclusion in the context of the question.',
    faqs: [
      {
        q: 'When can I use a binomial distribution?',
        a: 'When there is a fixed number of independent trials, each with two outcomes and the same probability of success. If a question asks you to criticise or justify a model, refer to these conditions in context.',
      },
      {
        q: 'What is the difference between σ and σ² in N(μ, σ²)?',
        a: 'The second number in N(μ, σ²) is the variance. Take its square root to get σ before you standardise. For example, N(50, 16) has standard deviation 4.',
      },
      {
        q: 'How do I decide whether to reject H₀ in a binomial test?',
        a: 'Find the probability of a result at least as extreme as the one observed, assuming H₀ is true. If it is less than or equal to the significance level, reject H₀. Otherwise there is not enough evidence to reject it.',
      },
    ],
  },
  'al-proof': {
    why: 'Proof is a named part of the A-Level Maths specification and can appear on any pure paper. Questions ask you to prove by deduction or exhaustion, or to disprove a statement with a counterexample.',
    key: 'Write an even number as 2n and an odd number as 2n + 1, where n is an integer. To show a result is a multiple of k, rearrange it into k × (an integer).',
    mistakes: [
      'Checking a few examples and calling it a proof.',
      'Using the same letter for two different odd numbers, which only proves the result when they are equal.',
      'Forgetting the middle term when expanding a bracket such as (3k + 2)².',
    ],
    examTip: 'Finish every proof with a clear sentence that links back to the statement, for example "so the sum is a multiple of 3".',
    faqs: [
      {
        q: 'What is a counterexample?',
        a: 'A single case where the statement is false. One counterexample is enough to disprove a statement that claims to be true for all values. Show the working that proves it fails.',
      },
      {
        q: 'When should I use proof by exhaustion?',
        a: 'Use it when every case falls into a small number of types, such as n = 3k, 3k + 1 and 3k + 2. You must check every case, then conclude that the statement holds in all of them.',
      },
      {
        q: 'How do I write odd and even numbers in a proof?',
        a: 'Use 2m for an even number and 2m + 1 for an odd number, where m is an integer. Use different letters, such as m and n, when the two numbers do not have to be equal.',
      },
    ],
  },
  'al-exponential-modelling': {
    why: 'Exponential models link exponentials and logarithms to real data such as population growth, depreciation and cooling. A-Level questions ask you to use a model, find its constants with logs and comment on whether it is sensible.',
    key: 'In P = P₀e^(kt), P₀ is the value when t = 0, and k is positive for growth and negative for decay. To find k or t, isolate the exponential term and take natural logs.',
    mistakes: [
      'Taking logs before the exponential term is on its own.',
      'Forgetting to subtract the constant in a model such as θ = 20 + 60e^(−kt) before taking logs.',
      'Losing the minus sign on k in a decay model.',
    ],
    examTip: 'After finding t or k, substitute it back into the model to check that it gives the value in the question.',
    faqs: [
      {
        q: 'How do I find k from two values?',
        a: 'Substitute the known values, divide to isolate e^(kt), then take natural logs. For example, 800 = 500e^(4k) gives e^(4k) = 1.6, so k = (ln 1.6) ÷ 4.',
      },
      {
        q: 'What does P₀ mean in an exponential model?',
        a: 'It is the value when t = 0, because e⁰ = 1. Questions often call it the initial value, and you can find it by dividing a later value by e^(kt).',
      },
      {
        q: 'How do I find a half-life or doubling time?',
        a: 'Set the model equal to half or double the initial value, and the initial value cancels. You get e^(kt) = 1/2 or 2, so the time is (ln 2) ÷ |k|.',
      },
    ],
  },
};
