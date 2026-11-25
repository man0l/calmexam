import type { TopicCopy } from './types';

export const CALC_NEW_COPY: Record<string, TopicCopy> = {
  'calc-implicit': {
    why: 'AP Calculus AB questions often hide the chain rule inside something else: a curve that is not solved for y, an inverse function, or a composite given only through a few values. If you can apply the chain rule in all three forms, a whole family of derivative questions becomes routine.',
    key: 'Differentiate both sides with respect to x and attach dy/dx every time you differentiate a y term, so y² becomes 2y·dy/dx. For composites, h′(x) = f′(g(x))·g′(x), and for an inverse g of f, g′(b) = 1/f′(a) where f(a) = b.',
    mistakes: [
      'Writing the derivative of y² as 2y and forgetting the dy/dx factor.',
      'Differentiating a product such as xy as x·dy/dx alone and dropping the y term from the product rule.',
      'Evaluating the outer derivative at x instead of at g(x), for example using f′(1) when the chain rule needs f′(g(1)).',
    ],
    examTip: 'Before you differentiate a composite from a list of values, write down the inner value first, such as g(1) = 2, then look up the outer derivative at that number.',
    faqs: [
      {
        q: 'When do I need implicit differentiation on the AP Calculus AB exam?',
        a: 'Use it when the equation mixes x and y and is hard or impossible to solve for y, such as x² + xy + y² = 7. Differentiate every term with respect to x, then solve the result for dy/dx. You can then substitute the point you are given.',
      },
      {
        q: 'How do I find the derivative of an inverse function at a point?',
        a: 'If g is the inverse of f and you want g′(b), first find the input a with f(a) = b. Then g′(b) = 1/f′(a). The common slip is evaluating f′ at b instead of at a.',
      },
      {
        q: 'How do I find a second derivative implicitly?',
        a: 'Differentiate your expression for dy/dx again, treating y as a function of x, so every y term picks up another dy/dx. Then substitute the expression for dy/dx back in. For a circle x² + y² = r², this gives d²y/dx² = −r²/y³.',
      },
    ],
  },
  'calc-contextual': {
    why: 'Related rates and motion questions test whether you can turn a situation into an equation and read a derivative as a rate with units. They appear in both the multiple-choice and free-response sections of AP Calculus AB, often with a table or a short story.',
    key: 'Write an equation that links the quantities, differentiate it with respect to time, and only then substitute the values at the instant you care about. For motion, v(t) = x′(t) and a(t) = v′(t), and the speed increases when v and a have the same sign.',
    mistakes: [
      'Substituting the fixed values, such as the radius at that instant, before differentiating, which turns a changing quantity into a constant.',
      'Deciding that a particle is speeding up just because the acceleration is positive, without checking the sign of the velocity.',
      'Leaving off units or the direction, for example giving a falling height as a positive rate of change without saying it is decreasing.',
    ],
    examTip: 'List every rate in the problem as a derivative, such as dr/dt = 3 cm/s, and mark the one you need with a question mark before you write any equation.',
    faqs: [
      {
        q: 'How do I set up a related rates problem in AP Calculus AB?',
        a: 'Draw or picture the situation, name the changing quantities, and write one equation that connects them, such as x² + y² = 13² for a ladder. Differentiate both sides with respect to t. Then substitute the values at the moment in the question and solve for the unknown rate.',
      },
      {
        q: 'How do I tell if a particle is speeding up or slowing down?',
        a: 'Find the velocity v(t) and the acceleration a(t) at the given time. If they have the same sign, the speed is increasing, and if they have opposite signs, the speed is decreasing. The sign of the acceleration alone is not enough.',
      },
      {
        q: 'When can I use the Mean Value Theorem with a table of values?',
        a: 'The function must be differentiable on the interval, which also makes it continuous. If the average rate of change between two table values equals k, the theorem guarantees some time between them where the derivative equals k. It tells you nothing about intervals whose average rate is different.',
      },
    ],
  },
  'calc-integration-applications': {
    why: 'On AP Calculus AB, a definite integral is rarely just a number to compute. You are asked what it means: an area, a volume, a displacement, or the amount that has built up from a rate, often from a table of data.',
    key: 'The integral of a rate over an interval gives the net change, so an amount at time T is the starting amount plus the integral of the rate. Area between curves is the integral of top minus bottom, and the disc method gives V = π∫ [f(x)]² dx.',
    mistakes: [
      'Forgetting to add the starting amount when a question asks for the amount at a later time rather than the change.',
      'Integrating velocity straight across an interval when the velocity changes sign, which gives displacement rather than total distance.',
      'Treating the subintervals in a table as equal width in a Riemann or trapezoidal sum when the times are unevenly spaced.',
    ],
    examTip: 'For total distance, find where the velocity is zero first, then integrate the pieces separately and add their absolute values.',
    faqs: [
      {
        q: 'What is the difference between displacement and total distance?',
        a: 'Displacement is the integral of v(t) and measures the net change in position, so motion backwards cancels motion forwards. Total distance is the integral of |v(t)| and counts every meter traveled. They match only when the velocity does not change sign.',
      },
      {
        q: 'How do I find the volume of a solid of revolution with the disc method?',
        a: 'When a region under y = f(x) is revolved about the x-axis, each slice is a disc with radius f(x). The volume is π times the integral of [f(x)]² over the interval. Square the whole function, including any constant in front.',
      },
      {
        q: 'How do I use a table of values to estimate an integral?',
        a: 'Multiply each value by the width of its subinterval and add the results. A left sum uses the first value of each subinterval, a right sum uses the last, and a trapezoidal sum averages the two. Check the widths carefully, because they are often unequal.',
      },
    ],
  },
  'calc-differential-equations': {
    why: 'Differential equations connect a rate to the quantity itself, which is how AP Calculus AB models growth, decay and cooling. You may be asked to read a slope field, find a particular solution, or use the equation directly to find a slope or a concavity at a point.',
    key: 'The equation dy/dt = ky separates to dy/y = k dt, which gives y = y₀e^(kt). To find a particular solution, integrate, then use the initial condition to find the constant.',
    mistakes: [
      'Adding the initial value as a constant after exponentiating instead of using it as the factor in front of e^(kt).',
      'Setting the constant equal to the initial y-value when the initial condition is given at an x-value other than 0.',
      'Treating y as a constant when finding the second derivative from a differential equation, which drops the dy/dx term.',
    ],
    examTip: 'When a question asks for concavity or the second derivative from a differential equation, find dy/dx at the point first, because you will need it again.',
    faqs: [
      {
        q: 'How do I solve dy/dt = ky in AP Calculus AB?',
        a: 'Separate the variables to get dy/y = k dt and integrate both sides to get ln|y| = kt + C. Exponentiate to get y = Ae^(kt), where A is the value of y when t = 0. A positive k means growth, and a negative k means decay.',
      },
      {
        q: 'How do I read a slope field?',
        a: 'Each short segment shows the slope of a solution curve passing through that point. To find it, substitute the x and y coordinates of the point into the expression for dy/dx. The segment is horizontal wherever that value is zero.',
      },
      {
        q: 'How do I find k from a doubling time or half-life?',
        a: 'If the quantity doubles every D units of time, then e^(kD) = 2, so k = (ln 2)/D. For a half-life of D, e^(kD) = 1/2, so k = −(ln 2)/D. The sign of k tells you whether the model grows or decays.',
      },
    ],
  },
};
