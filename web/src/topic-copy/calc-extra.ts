import type { TopicCopy } from './types';

export const CALC_EXTRA_COPY: Record<string, TopicCopy> = {
  'calc-limits': {
    why: 'Limits are the foundation of AP Calculus AB: continuity, the derivative and the definite integral are all defined with them. Questions test limits found by algebra, from piecewise definitions and at infinity.',
    key: 'A limit is the value f(x) approaches, which need not equal f(a). For rational functions at infinity compare the degrees, and remember that lim (x → 0) sin x / x = 1.',
    mistakes: [
      'Stopping at 0/0 and saying the limit does not exist, when factoring or a known limit would finish the job.',
      'Dividing the constant terms instead of the leading coefficients for a limit at infinity.',
      'Treating a one-sided limit as two-sided, or forgetting that a two-sided limit needs both sides to agree.',
    ],
    examTip: 'Try direct substitution first. A number is usually the answer, 0/0 means simplify, and a nonzero number over 0 means check the sign on each side.',
    faqs: [
      {
        q: 'How do I find a limit at infinity of a rational function?',
        a: 'Compare the degrees of the top and bottom. If they are equal, the limit is the ratio of the leading coefficients. If the bottom has the higher degree the limit is 0, and if the top has the higher degree the function grows without bound.',
      },
      {
        q: 'What does it mean for a function to be continuous at a point?',
        a: 'f(a) must exist, the limit as x approaches a must exist, and the two must be equal. For a piecewise function this means both pieces give the same value where they join.',
      },
      {
        q: 'When do I use lim sin x / x = 1?',
        a: 'Use it when direct substitution gives 0/0 and the expression contains sin(kx) or tan(kx) over a linear term. Rewrite so the angle inside the sine matches the denominator, then multiply by the leftover constant ratio.',
      },
    ],
  },
  'calc-derivatives': {
    why: 'Derivatives appear across the whole AP Calculus AB exam, in both multiple-choice and free-response questions. Quick, accurate use of the rules leaves more time for the harder application questions.',
    key: 'Know the power, product, quotient and chain rules, plus the derivatives of sin x, cos x, eˣ and ln x. The limit of [f(a + h) − f(a)] / h as h → 0 is f′(a).',
    mistakes: [
      'Multiplying the derivatives of two factors instead of using the product rule.',
      'Reversing the order in the quotient rule numerator, which flips the sign of the answer.',
      'Forgetting to multiply by the inner derivative when using the chain rule.',
    ],
    examTip: 'When a question shows a limit with h in it, check whether it is a derivative in disguise before doing any algebra.',
    faqs: [
      {
        q: 'When should I use the quotient rule instead of rewriting?',
        a: 'Use it when the denominator contains x and cannot be split into simple powers. If the denominator is a single term such as x², it is often quicker to rewrite with negative powers and use the power rule.',
      },
      {
        q: 'What is the derivative of ln(kx)?',
        a: 'It is 1/x for any positive constant k. The chain rule gives k/(kx), and the k cancels. You can also see this because ln(kx) = ln k + ln x.',
      },
      {
        q: 'How do I recognise a limit definition of the derivative?',
        a: 'Look for [f(a + h) − f(a)] / h as h → 0, or [f(x) − f(a)] / (x − a) as x → a. Identify the function f and the point a, and the limit equals f′(a).',
      },
    ],
  },
  'calc-applications': {
    why: 'Applications of derivatives connect the rules to graphs and real situations. AP Calculus AB questions ask for tangent lines, extrema, intervals of increase and concavity, and expect answers justified with the sign of f′ or f″.',
    key: 'f′ shows where f increases, decreases and turns; f″ shows concavity and points of inflection. On a closed interval, absolute extrema occur at critical points or at the endpoints.',
    mistakes: [
      'Forgetting to check the endpoints when finding an absolute maximum or minimum on a closed interval.',
      'Setting f′(x) = 0 to find a point of inflection instead of f″(x) = 0.',
      'Giving the x-value when the question asks for the maximum value of f.',
    ],
    examTip: 'Sketch a quick sign chart for f′ or f″ before answering. It shows increasing intervals, extrema and concavity at a glance, and it is the kind of justification free-response answers need.',
    faqs: [
      {
        q: 'How do I find the absolute maximum on a closed interval?',
        a: 'Find the critical points inside the interval, where f′ is zero or undefined. Evaluate f at those points and at both endpoints, then choose the largest value. This is often called the Candidates Test.',
      },
      {
        q: 'What is a tangent line approximation?',
        a: 'Near x = a, f(x) ≈ f(a) + f′(a)(x − a). It uses the tangent line in place of the curve, so it works best for x close to a.',
      },
      {
        q: 'How do I justify a point of inflection?',
        a: 'Show that f″ changes sign at that x-value. f″ = 0 on its own is not enough, because f″ can touch zero without changing sign.',
      },
    ],
  },
  'calc-integrals': {
    why: 'Integration is the second half of AP Calculus AB and is tied to the Fundamental Theorem of Calculus. Questions test antiderivatives, definite integrals, u-substitution and integral properties given only as numbers.',
    key: 'An antiderivative reverses differentiation, and the integral of f from a to b is F(b) − F(a). Integrals over adjacent intervals add, swapping the limits changes the sign, and constant factors come out.',
    mistakes: [
      'Raising the power when integrating but forgetting to divide by the new power.',
      'Keeping the original x-limits after a u-substitution.',
      'Getting the sign wrong on ∫ sin x dx, which is −cos x + C.',
    ],
    examTip: 'Check an indefinite integral by differentiating your answer. If you get back the integrand, it is right.',
    faqs: [
      {
        q: 'When should I use u-substitution?',
        a: 'Use it when the integrand contains a function and, up to a constant, its derivative, such as x(x² + 1)³. Let u be the inner function. For a definite integral, change the limits to u-values or switch back to x before substituting.',
      },
      {
        q: 'How do I use integral properties when f is not given?',
        a: 'Split or join intervals: the integral from a to c equals the integral from a to b plus the integral from b to c. Constants come out of the integral, and reversing the limits changes the sign.',
      },
      {
        q: 'Do I need + C on every indefinite integral?',
        a: 'Yes. An indefinite integral is a family of functions that differ by a constant. In a definite integral the constant cancels, so you can leave it out there.',
      },
    ],
  },
};
