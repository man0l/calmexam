import type { TopicCopy } from './types';

export const SAT_NEW_COPY: Record<string, TopicCopy> = {
  'sat-ratios': {
    why: 'Ratios and rates show up in many SAT word problems, from recipes and maps to speed and unit conversions. Setting them up cleanly saves time on questions that look long but need only one proportion.',
    key: 'Write the two quantities as a fraction, keep the units in the same order on both sides, and scale or cross-multiply. Average speed is total distance divided by total time.',
    mistakes: [
      'Flipping one side of a proportion so the units no longer match.',
      'Averaging two speeds instead of dividing total distance by total time.',
      'Converting only part of a rate, such as hours to minutes but not minutes to seconds.',
    ],
    examTip: 'Write the units next to every number in a conversion and check that the unwanted units cancel before you calculate.',
    faqs: [
      {
        q: 'How do I set up a proportion on the SAT?',
        a: 'Put matching quantities in the same position on both sides, for example cups over muffins equals cups over muffins. Then cross-multiply and solve. If the units are in a different order on each side, the answer will be wrong.',
      },
      {
        q: 'Why is average speed not the average of the two speeds?',
        a: 'A trip usually spends different amounts of time at each speed, so the speeds do not count equally. Find the total distance and the total time, then divide. The simple average only works when the times are equal.',
      },
      {
        q: 'How do I handle a ratio like 3 to 5 when I know the total?',
        a: 'Add the parts to get the number of equal shares, here 8. Divide the total by 8 to find one share, then multiply by 3 or 5. This gives each group and any difference between them.',
      },
    ],
  },
  'sat-probability': {
    why: 'SAT probability questions are usually about counting carefully, often from a two-way table. The hard part is choosing the right denominator, not the arithmetic.',
    key: 'Probability is favorable outcomes divided by possible outcomes. For a conditional probability, the condition decides the denominator, and for independent events you multiply.',
    mistakes: [
      'Dividing by the grand total of a table when the question restricts you to one row or column.',
      'Adding probabilities of independent events when you should multiply them.',
      'Forgetting that the chance of at least one event is 1 minus the chance of neither.',
    ],
    examTip: 'Underline the words after "given" or "of the" in the question, because that group is your denominator.',
    faqs: [
      {
        q: 'How do I find a conditional probability from a two-way table?',
        a: 'Find the row or column named in the condition and use its total as the denominator. The numerator is the cell where that row or column meets the outcome you want. Ignore the rest of the table.',
      },
      {
        q: 'When do I multiply probabilities?',
        a: 'Multiply when you want two independent events to both happen, such as two draws with replacement. If the first item is not put back, the second probability changes, so adjust the counts before multiplying.',
      },
      {
        q: 'What is the quickest way to find the probability that something does not happen?',
        a: 'Subtract the probability that it does happen from 1. For counts, you can also add up the outcomes that are not the named one and divide by the total. Both methods give the same fraction.',
      },
    ],
  },
  'sat-inequalities': {
    why: 'Inequalities appear as plain algebra and as budget or minimum-hours word problems on the SAT. Many questions also ask for the greatest or least whole number, which adds a rounding step.',
    key: 'Solve an inequality like an equation, but flip the sign whenever you multiply or divide by a negative number. In word problems, round in the direction the situation allows.',
    mistakes: [
      'Dividing by a negative number and keeping the inequality sign the same.',
      'Rounding a budget answer up, which spends more money than is available.',
      'Testing a point in only one inequality of a system.',
    ],
    examTip: 'After solving, plug in one easy number from your answer range to confirm that the sign points the right way.',
    faqs: [
      {
        q: 'When do I flip the inequality sign?',
        a: 'Flip it when you multiply or divide both sides by a negative number. Adding or subtracting never changes the direction. In a compound inequality, flip both signs at once.',
      },
      {
        q: 'How do I find the greatest integer that satisfies an inequality?',
        a: 'Solve for x first, then look at the boundary value. If x must be less than a non-integer, round down. If the boundary is an integer and the inequality is strict, the boundary itself does not count.',
      },
      {
        q: 'How do I check which point satisfies a system of inequalities?',
        a: 'Substitute the x and y values of each point into every inequality. A point is a solution only if all of the inequalities are true. One failure rules it out.',
      },
    ],
  },
  'sat-area-volume': {
    why: 'The SAT reference sheet lists the main area and volume formulas, but questions test whether you apply them correctly to composite shapes, diameters and scaled figures. Answers are often left in terms of π.',
    key: 'Break a composite shape into simple pieces and add or subtract their areas. If every length is multiplied by k, area is multiplied by k² and volume by k³.',
    mistakes: [
      'Using the diameter in place of the radius in πr² or πr²h.',
      'Forgetting the 1/3 in the volume of a cone or the 4/3 in the volume of a sphere.',
      'Multiplying an area or volume by the scale factor k instead of k² or k³.',
    ],
    examTip: 'Write the radius down before you use any circle, cylinder, cone or sphere formula, especially when the question gives a diameter.',
    faqs: [
      {
        q: 'Do I need to memorize area and volume formulas for the SAT?',
        a: 'The test provides a reference sheet with the common formulas, including cylinder, cone and sphere volume. Knowing them already saves time. The main skill is choosing the right formula and the right radius or height.',
      },
      {
        q: 'How does scaling a shape change its area and volume?',
        a: 'If every length is multiplied by k, area is multiplied by k squared and volume by k cubed. For example, doubling the lengths makes the area 4 times as large and the volume 8 times as large.',
      },
      {
        q: 'How do I find the area of a composite figure?',
        a: 'Split it into rectangles, triangles and parts of circles. Find each area, then add them, or subtract a piece that has been cut out. Keep the π terms separate so the answer stays exact.',
      },
    ],
  },
  'sat-trigonometry': {
    why: 'SAT trigonometry is mostly right-triangle work: sine, cosine and tangent as side ratios, the link between complementary angles, and radian measure. The numbers are usually Pythagorean triples, so exact fractions are expected.',
    key: 'For angle A, sin A is opposite over hypotenuse, cos A is adjacent over hypotenuse, and tan A is opposite over adjacent. sin x° = cos(90° − x°), and 180° equals π radians.',
    mistakes: [
      'Reading the opposite and adjacent sides from the wrong angle.',
      'Setting complementary angles equal to each other instead of adding them to 90°.',
      'Using 360° instead of 180° for π when converting between degrees and radians.',
    ],
    examTip: 'Label the sides opposite, adjacent and hypotenuse from the angle in the question before writing any ratio.',
    faqs: [
      {
        q: 'What does sin x = cos(90° − x) mean on the SAT?',
        a: 'The two acute angles of a right triangle add up to 90°, and the side opposite one angle is adjacent to the other. So the sine of one acute angle equals the cosine of the other. If sin a° = cos b° for acute angles, then a + b = 90.',
      },
      {
        q: 'How do I convert degrees to radians?',
        a: 'Multiply the degree measure by π/180. To go from radians to degrees, multiply by 180/π. For example, 60° is π/3 radians.',
      },
      {
        q: 'How do I find a missing side when I know a trig ratio?',
        a: 'The ratio tells you the shape of the triangle, such as sin A = 5/13. Use the given side to find the scale factor, then find the third side with the Pythagorean theorem or a known triple. Multiply each basic side by the same scale factor.',
      },
    ],
  },
  'sat-nonlinear-functions': {
    why: 'Nonlinear function questions on the SAT cover composition, absolute value, polynomial zeros, transformations and exponential models. They reward reading the function notation carefully.',
    key: 'Evaluate compositions from the inside out. Zeros come from setting each factor equal to 0, and f(x + a) + b moves the graph a units left and b units up.',
    mistakes: [
      'Computing g(f(x)) when the question asks for f(g(x)).',
      'Reading a factor x + 3 as a zero at 3 instead of −3.',
      'Shifting a graph right for f(x + a) when it actually moves left.',
    ],
    examTip: 'For a composition, write the inner value on its own line first, then substitute it into the outer function.',
    faqs: [
      {
        q: 'How do I evaluate f(g(x)) on the SAT?',
        a: 'Start with the inside function. Find g of the given number, then use that result as the input to f. Doing it in the other order usually gives a different answer.',
      },
      {
        q: 'How do I solve an absolute value equation?',
        a: 'First isolate the absolute value on one side. Then split it into two equations, one equal to the positive value and one to the negative value. An absolute value equal to a negative number has no solution.',
      },
      {
        q: 'How do shifts change the vertex of a parabola?',
        a: 'If f has vertex (h, k), then f(x + a) + b has vertex (h − a, k + b). A change inside the parentheses moves the graph the opposite way horizontally. A change outside moves it the same way vertically.',
      },
    ],
  },
  'sat-data': {
    why: 'Data questions on the SAT ask you to read lists, frequency tables and two-way tables, and to compare measures like mean, median and range. They test careful reading more than long calculation.',
    key: 'Sort the data before finding a median, and use frequencies to count repeated values. An outlier pulls the mean much more than the median.',
    mistakes: [
      'Finding the middle of an unsorted list.',
      'Taking the median of the frequencies instead of the data values.',
      'Using the grand total of a table when the question asks about one group.',
    ],
    examTip: 'With a frequency table, write running totals beside the frequencies so you can see which value holds the middle position.',
    faqs: [
      {
        q: 'How do I find the median from a frequency table?',
        a: 'Add the frequencies to get the number of data values. Find the middle position, then use running totals to see which value reaches that position. If the count is even, average the two middle values.',
      },
      {
        q: 'How does an outlier affect the mean and the median?',
        a: 'A very large or very small value changes the mean a lot because it is part of the sum. The median depends only on the middle position, so it changes little or not at all. This is why the median is often a better summary for skewed data.',
      },
      {
        q: 'How do I find a percent from a two-way table?',
        a: 'Decide which group the question is about and use its total as the whole. Divide the matching cell by that total and multiply by 100. Using the wrong row or column total is the most common error.',
      },
    ],
  },
};
