import type { TopicCopy } from './types';

export const ALEVEL_EXTRA_COPY: Record<string, TopicCopy> = {
  'al-algebra': {
    why: 'Algebra is the toolkit for almost every other A-Level Maths topic. Completing the square, the factor theorem and quadratic inequalities come up on their own and inside longer calculus and coordinate questions.',
    key: 'x² + bx + c = (x + b/2)² + c − (b/2)², and (x − k) is a factor of f(x) exactly when f(k) = 0.',
    mistakes: [
      'Forgetting to subtract (b/2)² when completing the square.',
      'Substituting x = −k instead of x = k when (x − k) is a factor.',
      'Choosing the region between the roots when the inequality needs the region outside them, or the other way round.',
    ],
    examTip: 'For a quadratic inequality, sketch the parabola and its roots in the margin before writing the answer. The sketch shows which region you need.',
    faqs: [
      {
        q: 'How do I complete the square when the coefficient of x² is not 1?',
        a: 'Take the coefficient out of the x² and x terms first, so 2x² + 12x + 5 becomes 2(x² + 6x) + 5. Complete the square inside the bracket, then multiply back out the constant you subtracted. Check by expanding your answer.',
      },
      {
        q: 'What is the difference between the factor theorem and the remainder theorem?',
        a: 'The remainder theorem says that dividing f(x) by (x − a) leaves remainder f(a). The factor theorem is the special case where that remainder is 0, so (x − a) is a factor. Both only need you to substitute x = a.',
      },
      {
        q: 'How should I write the answer to a quadratic inequality?',
        a: 'Region between the roots: write a single inequality such as −2 < x < 5. Region outside them: write two parts such as x < −2 or x > 5. Set notation like {x : x < −2} ∪ {x : x > 5} is also accepted when the question asks for it.',
      },
    ],
  },
  'al-differentiation': {
    why: 'Differentiation gives gradients, tangents, normals and stationary points. These skills support optimisation problems and much of the later calculus in the course.',
    key: 'd/dx(xⁿ) = nxⁿ⁻¹ for any rational n, d/dx(e^(kx)) = ke^(kx), and d/dx(ln(kx)) = 1/x.',
    mistakes: [
      'Writing √x as x² or 1/x as x instead of x^(1/2) and x⁻¹ before differentiating.',
      'Using the tangent gradient for the normal instead of −1 divided by it.',
      'Mixing up the second derivative rule: positive means a minimum, negative means a maximum.',
    ],
    examTip: 'Rewrite every root and fraction as a power of x before you differentiate. Most lost marks come from that first step, not the calculus.',
    faqs: [
      {
        q: 'How do I find the equation of a normal to a curve?',
        a: 'Differentiate and substitute the x-value to get the tangent gradient m. The normal gradient is −1/m. Use y − y₁ = (−1/m)(x − x₁) with the point on the curve, then rearrange into the form the question asks for.',
      },
      {
        q: 'What if the second derivative is zero at a stationary point?',
        a: 'The test does not decide the nature in that case. Check the sign of dy/dx just either side of the point instead. A change from positive to negative is a maximum, negative to positive is a minimum, and no change is a point of inflection.',
      },
      {
        q: 'Why is the derivative of ln(3x) the same as the derivative of ln x?',
        a: 'By the laws of logs, ln(3x) = ln 3 + ln x. The ln 3 part is a constant, so its derivative is 0. Both functions therefore have derivative 1/x.',
      },
    ],
  },
  'al-integration': {
    why: 'Integration reverses differentiation and finds areas under curves. Questions often combine it with factorising, finding roots or a numerical estimate such as the trapezium rule.',
    key: '∫ xⁿ dx = xⁿ⁺¹/(n + 1) + c for n ≠ −1, ∫ 1/x dx = ln|x| + c, and an area below the x-axis gives a negative integral.',
    mistakes: [
      'Multiplying by the new power instead of dividing by it.',
      'Leaving out the constant of integration, then being unable to use a given point on the curve.',
      'Giving a negative value as an area when the region lies below the x-axis.',
    ],
    examTip: 'Before integrating for an area, find where the curve crosses the x-axis. If the region is split by the axis, integrate each part separately and add their sizes.',
    faqs: [
      {
        q: 'How do I find the equation of a curve from dy/dx?',
        a: 'Integrate dy/dx and include + c. Substitute the coordinates of the given point to find c. Then write the full equation with that value of c.',
      },
      {
        q: 'When does the trapezium rule overestimate or underestimate?',
        a: 'If the curve is concave up over the interval, the straight tops of the trapezia sit above it, so the rule overestimates. If the curve is concave down, it underestimates. Using more strips makes the estimate closer.',
      },
      {
        q: 'How do I integrate √x or 1/√x?',
        a: 'Write them as x^(1/2) and x^(−1/2). Add 1 to the power and divide by the new power, giving (2/3)x^(3/2) and 2x^(1/2). Dividing by a fraction is the same as multiplying by its reciprocal.',
      },
    ],
  },
  'al-exponentials-logs': {
    why: 'Logarithms let you solve equations where the unknown is a power. They also appear in calculus with e and ln, and in modelling growth and decay.',
    key: 'log a + log b = log ab, log a − log b = log(a/b), n log a = log aⁿ, and logₐ b = log b ÷ log a.',
    mistakes: [
      'Treating log(x + k) as log x + log k.',
      'Dividing the logs the wrong way round when solving aˣ = b.',
      'Keeping a negative root of a log equation, even though the log of a negative number is undefined.',
    ],
    examTip: 'After solving any log equation, substitute each answer back into the original logs. Reject any value that makes the inside of a log zero or negative.',
    faqs: [
      {
        q: 'How do I solve an equation like 3ˣ = 20?',
        a: 'Take logs of both sides to get x log 3 = log 20. Then x = log 20 ÷ log 3. You can use log base 10 or ln, as long as you use the same one on top and bottom.',
      },
      {
        q: 'What is the change of base formula used for?',
        a: 'It rewrites logₐ b as log b ÷ log a in any base you choose. It helps with calculators and with exact values such as log₈ 32, where both numbers are powers of 2. That example gives 5/3.',
      },
      {
        q: 'Why do some log equations turn into quadratics?',
        a: 'Combining logs such as log x + log(x + 2) gives log(x(x + 2)). Removing the log leaves a quadratic in x. Solve it, then check each root, because only values that keep every log defined are valid.',
      },
    ],
  },
  'al-sequences': {
    why: 'Sequences and series test whether you can spot structure and use the right formula. They lead into financial and growth problems, and sigma notation appears across the course.',
    key: 'For a geometric series, uₙ = arⁿ⁻¹ and Sₙ = a(rⁿ − 1)/(r − 1). A recurrence relation uₙ₊₁ = f(uₙ) builds each term from the one before.',
    mistakes: [
      'Using the r = 0 term as the first term when a sigma sum starts at r = 1.',
      'Forgetting to take the root when finding r from two terms several places apart.',
      'Stopping one term short when generating terms from a recurrence relation.',
    ],
    examTip: 'For a sigma sum, write out the first two or three terms before using a formula. That shows the first term, the ratio or difference, and how many terms there are.',
    faqs: [
      {
        q: 'How do I find the common ratio from two terms of a geometric sequence?',
        a: 'Divide the later term by the earlier one. If they are k places apart, the result is rᵏ, so take the kth root. With an even k there are two real roots, so use the condition in the question to choose.',
      },
      {
        q: 'How many terms are in Σ from r = 1 to n?',
        a: 'There are n terms, from r = 1 up to r = n. If the sum starts at r = 0, there are n + 1 terms. In general, the count is the top value minus the bottom value plus 1.',
      },
      {
        q: 'What does a recurrence relation like uₙ₊₁ = 2uₙ + 3 mean?',
        a: 'Each term is found from the previous one: double it, then add 3. You need a starting value such as u₁ to begin. Work through the terms one at a time and label each one.',
      },
    ],
  },
  'al-trigonometry': {
    why: 'Trigonometry covers triangles that are not right-angled, circular measure in radians and trig equations. It also underpins later work in calculus and mechanics.',
    key: 'a/sin A = b/sin B, a² = b² + c² − 2bc cos A, arc length = rθ and sector area = ½r²θ with θ in radians, and sin²θ + cos²θ = 1.',
    mistakes: [
      'Leaving the calculator in the wrong angle mode for degrees or radians.',
      'Using the sector formulas rθ and ½r²θ with an angle in degrees.',
      'Missing the second solution of a trig equation in the given interval.',
    ],
    examTip: 'Check your calculator mode at the start of every trig question. Sketch the sine or cosine graph across the interval to find every solution.',
    faqs: [
      {
        q: 'When should I use the sine rule and when the cosine rule?',
        a: 'Use the cosine rule when you know two sides and the angle between them, or all three sides. Use the sine rule when you know a side and its opposite angle, plus one more side or angle. Label the triangle first so the letters match.',
      },
      {
        q: 'Why do arc length and sector area formulas need radians?',
        a: 'The formulas rθ and ½r²θ come from defining a radian as the angle for an arc equal to the radius. In degrees you would need θ/360 × 2πr instead. Convert degrees to radians by multiplying by π/180.',
      },
      {
        q: 'How do I solve an equation with both sin θ and cos²θ?',
        a: 'Use cos²θ = 1 − sin²θ to write everything in terms of sin θ. This gives a quadratic in sin θ that you can factorise. Reject any value outside −1 to 1, then solve the rest in the interval.',
      },
    ],
  },
  'al-coordinate-geometry': {
    why: 'Coordinate geometry links algebra to straight lines and circles. Many questions ask for an exact equation in a set form, so accuracy with signs matters.',
    key: 'Gradient = (y₂ − y₁)/(x₂ − x₁), perpendicular gradients multiply to −1, and a tangent to a circle is perpendicular to the radius at that point.',
    mistakes: [
      'Writing the change in x over the change in y for the gradient.',
      'Using the radius gradient for the tangent instead of the perpendicular gradient.',
      'Leaving fractions in an answer that must be written as ax + by + c = 0 with integers.',
    ],
    examTip: 'When the question asks for ax + by + c = 0, multiply through by every denominator, collect all terms on one side, and check that the given points satisfy your equation.',
    faqs: [
      {
        q: 'How do I find the tangent to a circle at a given point?',
        a: 'Find the centre, then the gradient of the radius from the centre to the point. The tangent gradient is −1 divided by that. Use y − y₁ = m(x − x₁) with the point on the circle.',
      },
      {
        q: 'How do I find the midpoint and the length of a line segment?',
        a: 'The midpoint is the average of the x-coordinates and the average of the y-coordinates. The length comes from Pythagoras: √((x₂ − x₁)² + (y₂ − y₁)²). Leave the length as a surd if it is not a whole number.',
      },
      {
        q: 'Is y = mx + c accepted when the question asks for ax + by + c = 0?',
        a: 'Not if the form is stated. Rearrange so every term is on one side and the coefficients are integers. For example, y = (2/3)x + 1 becomes 2x − 3y + 3 = 0.',
      },
    ],
  },
  'al-mechanics': {
    why: 'Mechanics applies the maths to motion and forces. Newton\'s second law, velocity-time graphs, pulleys and moments all rely on a clear diagram and a careful choice of equation.',
    key: 'Resultant force = mass × acceleration, distance travelled is the area under a velocity-time graph, and a body in equilibrium has zero resultant force and zero total moment about any point.',
    mistakes: [
      'Using a single applied force in F = ma instead of the resultant force.',
      'Dividing by one mass instead of the total mass for connected particles.',
      'Forgetting the weight of a uniform beam, which acts at its midpoint.',
    ],
    examTip: 'Draw a force diagram for every body before writing equations. Mark the direction of motion so each force gets the right sign.',
    faqs: [
      {
        q: 'How do I find the acceleration of two particles over a pulley?',
        a: 'Write F = ma for each particle, taking the direction of motion as positive. The tension is the same in both equations, so adding them removes it. Solve for a, then substitute back if you also need the tension.',
      },
      {
        q: 'Where should I take moments for a beam problem?',
        a: 'Take moments about a point where an unknown force acts, often a support. That force then has no moment and drops out. Resolve vertically afterwards to find the other unknown.',
      },
      {
        q: 'What value of g should I use?',
        a: 'Use the value given in the question. Many A-Level papers state g = 9.8 m s⁻². If you use a rounded value such as 10, your answers may not match the mark scheme.',
      },
    ],
  },
};
