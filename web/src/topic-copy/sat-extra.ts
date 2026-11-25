import type { TopicCopy } from './types';

export const SAT_EXTRA_COPY: Record<string, TopicCopy> = {
  'sat-linear-equations': {
    why: 'Linear equations sit underneath most of the Algebra domain on the SAT. If you can solve them quickly and cleanly, you save time for the harder questions later in each module.',
    key: 'Do the same operation to both sides until x is alone: distribute, collect x terms on one side, then divide by the coefficient. If the x terms cancel, the equation has either no solution or infinitely many.',
    mistakes: [
      'Distributing a number to the first term in the brackets but not to the second.',
      'Changing the sign of a term when it moves across the equals sign, and then changing it again by accident.',
      'Solving for x when the question asks for an expression such as 3x + 2.',
    ],
    examTip: 'Before you solve, reread what the question asks for. If it wants an expression like 2x − 5, look for a way to get that expression directly instead of finding x first.',
    faqs: [
      {
        q: 'How do I tell if a linear equation has no solution or infinitely many solutions?',
        a: 'Simplify both sides fully. If the x coefficients are different, there is exactly one solution. If they match and the constants also match, every x works, and if they match but the constants differ, there is no solution.',
      },
      {
        q: 'What is the fastest way to solve an equation with fractions?',
        a: 'Multiply every term on both sides by the least common denominator. This clears the fractions in one step, and the rest is an ordinary linear equation.',
      },
      {
        q: 'What does it mean to solve for an expression instead of x?',
        a: 'Some questions ask for the value of something like 4x + 6. Often the equation is a multiple of that expression, so one division gives the answer. You can also find x and substitute, but it takes longer.',
      },
    ],
  },
  'sat-linear-functions': {
    why: 'Lines and linear functions show up across the SAT, in pure algebra and in word problems about rates and costs. Many questions test whether you can move between two points, an equation and a description in words.',
    key: 'Slope is the change in y divided by the change in x, and in y = mx + b the slope is m and the y-intercept is (0, b). Parallel lines share a slope, and perpendicular slopes are negative reciprocals.',
    mistakes: [
      'Dividing the change in x by the change in y, which turns the slope upside down.',
      'Taking the slope of ax + by = c as a/b instead of −a/b.',
      'Finding f(k) when the question gives f(x) = k and asks for x.',
    ],
    examTip: 'When a line is given as ax + by = c, rewrite it as y = mx + b first. It takes a few seconds and makes the slope and intercept easy to read.',
    faqs: [
      {
        q: 'How do I find the y-intercept from two points?',
        a: 'First find the slope from the two points. Then substitute one point into y = mx + b and solve for b. The y-intercept is the point (0, b).',
      },
      {
        q: 'What is the slope of a line perpendicular to a given line?',
        a: 'Take the negative reciprocal of the original slope. For a slope of 2/3, the perpendicular slope is −3/2. The two slopes multiply to −1.',
      },
      {
        q: 'What does the slope mean in a word problem?',
        a: 'The slope is the change in the output for each one-unit increase in the input. In a cost model, it is often the price per item or per hour, and the y-intercept is the starting fee.',
      },
    ],
  },
  'sat-systems': {
    why: 'Systems of two linear equations are a regular part of SAT algebra. They appear as plain equations, as word problems about tickets, coins or prices, and as questions about when a system has no solution.',
    key: 'Use substitution when one equation already gives y or x, and elimination when the coefficients line up. A system has no solution when the lines have the same slope but different intercepts.',
    mistakes: [
      'Finding x and giving it as the answer when the question asks for y or for x + y.',
      'Making a sign error when subtracting one equation from another.',
      'Setting up a word problem with the prices attached to the wrong unknowns.',
    ],
    examTip: 'If the question asks for x + y or x − y, try adding or subtracting the two equations before you solve for each variable. It often gives the answer in one step.',
    faqs: [
      {
        q: 'Should I use substitution or elimination on the SAT?',
        a: 'Use substitution when one equation is already solved for a variable, such as y = 3x − 2. Use elimination when the coefficients match or are easy to match. Both give the same answer, so pick the one with less arithmetic.',
      },
      {
        q: 'How do I find k so that a system has no solution?',
        a: 'Make the x and y coefficients proportional so the lines are parallel. Then check that the constants are not in the same ratio, otherwise the lines are the same and there are infinitely many solutions.',
      },
      {
        q: 'How do I set up a ticket or coin word problem?',
        a: 'Write one equation for the number of items and one for the total value. For example, a + s = 120 counts tickets and 12a + 5s = 1090 adds up the money. Then solve the system.',
      },
    ],
  },
  'sat-quadratics': {
    why: 'Quadratics are one of the main nonlinear topics in SAT math. Questions ask about solutions, the vertex, the number of real solutions and the sum or product of the roots, so one method is rarely enough.',
    key: 'For ax² + bx + c = 0, the solutions add to −b/a and multiply to c/a, and the discriminant b² − 4ac tells you how many real solutions there are. In vertex form y = a(x − h)² + k, the vertex is (h, k).',
    mistakes: [
      'Reading the vertex of y = (x − 3)² + 5 as (−3, 5) instead of (3, 5).',
      'Using −b for the sum of the roots without dividing by a.',
      'Treating a discriminant of zero as two solutions instead of exactly one.',
    ],
    examTip: 'Pick the form that matches the question. Factored form gives the roots, vertex form gives the vertex, and standard form gives the y-intercept and the sum and product of the roots.',
    faqs: [
      {
        q: 'How do I find the sum of the solutions without solving the quadratic?',
        a: 'Write the equation as ax² + bx + c = 0. The sum of the solutions is −b/a and the product is c/a. This works even when the solutions are not whole numbers.',
      },
      {
        q: 'How can I tell how many real solutions a quadratic has?',
        a: 'Compute the discriminant b² − 4ac. If it is positive there are two real solutions, if it is zero there is one, and if it is negative there are none.',
      },
      {
        q: 'How do I read the vertex from vertex form?',
        a: 'In y = a(x − h)² + k, the vertex is (h, k). The x-coordinate has the opposite sign of the number shown inside the brackets, so y = (x + 4)² − 1 has its vertex at (−4, −1).',
      },
    ],
  },
  'sat-percentages': {
    why: 'Percent questions appear in the Problem-Solving and Data Analysis domain, often inside real situations like prices, taxes and surveys. They reward careful thinking about what the percent is taken of.',
    key: 'A percent change multiplies by (1 + r) for an increase or (1 − r) for a decrease. Percent change is (new − old) ÷ old, and to undo a change you divide by the multiplier.',
    mistakes: [
      'Finding the original price by adding the discount percent back onto the sale price.',
      'Dividing by the new value instead of the original value when finding a percent change.',
      'Adding two successive percent changes instead of multiplying their factors.',
    ],
    examTip: 'Turn every percent change into a multiplier, such as 0.85 for 15% off or 1.06 for 6% tax. Then the problem becomes one multiplication or one division.',
    faqs: [
      {
        q: 'How do I find the original price after a discount?',
        a: 'Divide the sale price by the multiplier. After a 20% discount the sale price is 0.8 times the original, so the original is the sale price divided by 0.8.',
      },
      {
        q: 'How do I calculate percent increase between two numbers?',
        a: 'Subtract the old value from the new value and divide by the old value. Multiply by 100 to write it as a percent.',
      },
      {
        q: 'What does "a percent of a percent" mean?',
        a: 'It means you apply one percent to a smaller group. For example, 25% of 40% of 600 is 0.25 × 0.4 × 600 = 60. Take the second percent of the group, not of the original total.',
      },
    ],
  },
  'sat-exponentials': {
    why: 'Exponential models appear on the SAT in growth and decay situations, such as populations, investments and medicine levels. You need to read the model and also tell exponential change apart from linear change.',
    key: 'In f(t) = a·bᵗ, a is the starting value and b is the factor for each time period. If b = 1 + r the amount grows by r each period, and if b = 1 − r it shrinks by r.',
    mistakes: [
      'Reading a growth factor of 1.06 as 106% growth instead of 6% growth.',
      'Multiplying by 2 times the number of doublings instead of raising 2 to that power.',
      'Using the total time as the exponent instead of the number of doubling or halving periods.',
    ],
    examTip: 'Find the number of periods first, such as total time divided by the half-life. Then write the answer as starting value times factor to that power.',
    faqs: [
      {
        q: 'How do I find the growth rate from an exponential function?',
        a: 'Look at the base b in a·bᵗ. Subtract 1 from b and write the result as a percent, so a base of 1.08 means 8% growth per period. A base of 0.92 means an 8% decrease per period.',
      },
      {
        q: 'How do I work out a half-life problem?',
        a: 'Divide the total time by the half-life to get the number of halvings. Then multiply the starting amount by 1/2 that many times.',
      },
      {
        q: 'How is compound interest different from simple interest?',
        a: 'Simple interest adds the same amount each year, based on the original deposit. Compound interest multiplies the balance by the same factor each year, so the interest also earns interest.',
      },
    ],
  },
  'sat-circles': {
    why: 'Circle questions on the SAT cover arc length, sector area, circumference and the equation of a circle in the xy-plane. Many of them reduce to one proportion or one completed square.',
    key: 'Circumference is 2πr and area is πr². An arc or sector is the fraction (angle ÷ 360°) of the whole circle, and (x − h)² + (y − k)² = r² is a circle with center (h, k) and radius r.',
    mistakes: [
      'Using the diameter as the radius in the area formula.',
      'Giving r² as the radius when reading a circle equation.',
      'Reading the center of (x + 3)² + (y − 2)² = 25 as (3, −2) instead of (−3, 2).',
    ],
    examTip: 'For arcs and sectors, write the fraction of the circle first. Multiply that fraction by the circumference for an arc, or by the area for a sector.',
    faqs: [
      {
        q: 'How do I find the radius from a circle equation that is not in standard form?',
        a: 'Group the x terms and the y terms, then complete the square for each. Move the constants to the right side, and the right side is r². Take the square root to get the radius.',
      },
      {
        q: 'What is the formula for arc length?',
        a: 'Arc length is (central angle ÷ 360°) × 2πr. If the angle is in radians, arc length is simply the radius times the angle.',
      },
      {
        q: 'How do I check whether a point lies on a circle?',
        a: 'Substitute the point into the circle equation. If the left side equals r², the point is on the circle. If it is smaller the point is inside, and if it is larger the point is outside.',
      },
    ],
  },
  'sat-geometry': {
    why: 'Right triangles appear throughout SAT geometry and trigonometry. Knowing the Pythagorean theorem, the common triples and the two special right triangles saves a lot of calculation.',
    key: 'In a right triangle, a² + b² = c². A 45°, 45°, 90° triangle has sides in the ratio 1 : 1 : √2, and a 30°, 60°, 90° triangle has sides in the ratio 1 : √3 : 2.',
    mistakes: [
      'Adding the side lengths instead of their squares.',
      'Swapping the legs in a 30°, 60°, 90° triangle, so the √3 goes on the side opposite 30°.',
      'Halving the hypotenuse of a 45°, 45°, 90° triangle instead of dividing by √2.',
    ],
    examTip: 'Learn the triples 3-4-5, 5-12-13, 8-15-17 and 7-24-25, and their multiples. When two sides match one of these, you can write the third side straight away.',
    faqs: [
      {
        q: 'What are the side ratios of the special right triangles?',
        a: 'A 45°, 45°, 90° triangle has legs of equal length and a hypotenuse that is a leg times √2. A 30°, 60°, 90° triangle has a hypotenuse twice the short leg, and the long leg is the short leg times √3.',
      },
      {
        q: 'How do I find the distance between two points?',
        a: 'Find the horizontal change and the vertical change between the points. Use them as the legs of a right triangle and apply the Pythagorean theorem.',
      },
      {
        q: 'How are similar triangles used in right triangle questions?',
        a: 'Similar triangles have equal angles, so their corresponding sides share one scale factor. Find the scale factor from one pair of sides, then multiply to get the missing side.',
      },
    ],
  },
  'sat-statistics': {
    why: 'Mean questions on the SAT often go beyond adding and dividing. They ask what happens when a value is removed or added, how two groups combine, or how changing every value changes the mean.',
    key: 'Mean equals total divided by count, so total equals mean times count. Most mean questions become easier when you work with totals instead of means.',
    mistakes: [
      'Averaging the means of two groups of different sizes instead of using a weighted mean.',
      'Keeping the old count after removing a value from a data set.',
      'Thinking that adding a constant to every value leaves the mean unchanged.',
    ],
    examTip: 'Convert every mean in the question into a total first. Add or subtract the totals, then divide by the new count at the end.',
    faqs: [
      {
        q: 'How do I find a combined mean of two groups?',
        a: 'Multiply each group mean by its group size to get the totals. Add the totals and divide by the total number of members. The combined mean is closer to the mean of the larger group.',
      },
      {
        q: 'What happens to the mean if I add the same number to every value?',
        a: 'The mean increases by that same number. If you multiply every value by a number, the mean is multiplied by that number too.',
      },
      {
        q: 'How do I find the mean of consecutive integers quickly?',
        a: 'For evenly spaced numbers, the mean equals the middle value, which is also the average of the first and last values. With an odd count, that is the number exactly in the middle.',
      },
    ],
  },
};
