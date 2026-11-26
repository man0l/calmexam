# SAT engine expansion plan

Goal: make CalmExam's SAT Math practice match the digital SAT closely enough to prepare a student for a 650+ score on its own. Each template added to `src/engine/` reaches calmexam.com on the next push to `main` and the app on its next store release, so this work is done once for both.

## Where we are (measured 26 Nov 2026)

- 16 SAT topics, 80 templates (5 per topic), all multiple choice.
- Difficulty split: 23 warm-up, 40 core, 17 stretch.
- 200 seeds give 500–1,000 distinct prompts per topic, so repeats are not the problem. The number of question shapes is.
- Text-only prompts: no graphs, tables or figures.
- Today's session picks random templates from weak topics, with no difficulty ramp.
- The app's store build (1.0.2, 22 Nov) predates 7 engine commits. Ship a release so phones get the latest topics.

## Digital SAT Math blueprint vs coverage

44 questions across 2 adaptive modules (22 each, 35 min each). About 25% are student-produced response (SPR, "grid-in").

| Domain (share of test) | Skill | Coverage |
|---|---|---|
| Algebra (~35%) | Linear equations in one variable | Yes |
| | Linear equations in two variables | Partial (inside linear functions) |
| | Linear functions | Yes |
| | Systems of two linear equations | Yes |
| | Linear inequalities | Yes |
| Advanced Math (~35%) | Equivalent expressions (factoring, exponents, radicals, rational expressions) | **Missing** |
| | Nonlinear equations and systems (line–parabola, rational, radical, absolute value) | **Missing** (quadratics only) |
| | Nonlinear functions | Yes, plus exponentials |
| Problem-Solving & Data (~15%) | Ratios, rates, proportions, units | Yes (unit conversion thin) |
| | Percentages | Yes |
| | One-variable data (mean, median, spread, standard deviation comparison) | Partial (no SD) |
| | Two-variable data (scatterplots, line of best fit) | **Missing** |
| | Probability and conditional probability | Partial (conditional: 1 hit) |
| | Inference from samples, margin of error | **Missing** |
| | Evaluating statistical claims (observational vs experiment) | **Missing** |
| Geometry & Trig (~15%) | Area and volume | Yes |
| | Lines, angles, triangles (similarity, congruence, angle theorems) | **Missing** |
| | Right triangles and trigonometry | Yes |
| | Circles | Yes |

## Phases

### Phase 1: Grid-in (SPR) versions (biggest realism gain, lowest cost)
- The engine already has `style: 'frq'` (AP Calc uses it). Add SPR templates for SAT: same builders, answer entered as a number or fraction.
- Core change: an SPR answer type in `Problem` (`answerKind: 'choice' | 'numeric'`, accepted forms such as `3/4`, `.75`, `0.75`). The engine checks equivalence, never the model.
- App: a numeric keypad input in `PracticeSessionScreen` for SPR problems. Site: an input in `problemHtml()` and `client.ts`.
- Target: at least 2 SPR templates per topic (32+), so ~25% of Today's session can be SPR.

### Phase 2: Missing Advanced Math (35% of the test)
New topics, 6+ templates each, at all three difficulty levels:
- `sat-equivalent-expressions`: factoring, exponent rules, radicals, rational expressions, "which expression is equivalent".
- `sat-nonlinear-systems`: line–parabola intersections, number of solutions, rational and radical equations, absolute value.

### Phase 3: Missing data and geometry
- `sat-two-variable-data`: scatterplot described as a table of points, line of best fit, predicted vs actual, slope interpretation.
- `sat-inference`: sample to population, margin of error, which conclusion is supported, observational vs randomised experiment.
- `sat-lines-angles-triangles`: parallel lines and transversals, triangle angle sum, similar triangles and scale factors.
- Extend `sat-statistics` with standard deviation comparison and `sat-probability` with conditional probability from two-way tables.

### Phase 4: Harder questions and a difficulty ramp
- Lift stretch templates from 17 to 40+ (multi-step, parameters such as "for what value of k has no solution").
- Today's session: start from the student's accuracy band and ramp warm-up → core → stretch as answers come in.

### Phase 5: Figures and a full mock test
- Rendered graphs and tables (SVG from template data) in a shared component for app and site.
- A mock test mode: 2 × 22 questions, timer optional and off by default (no countdown pressure), score estimate at the end.

## Rules for every new template
- Answer computed by the builder; wrong choices come from named mistakes (sign slip, wrong formula), each listed in `pitfalls`.
- `npm run verify:engine` must pass: unique answer, no duplicate choices, answer in choices.
- Each new topic gets topic copy in `web/src/topic-copy/` so it also becomes a site landing page.

## Order and size
| Phase | New templates | Notes |
|---|---|---|
| 1 SPR | ~32 | needs an input on app and site |
| 2 Advanced Math | ~12 | highest test weight |
| 3 Data + geometry | ~24 | 3 new topics, 2 extended |
| 4 Hard + ramp | ~25 | session logic change in `services/practice.ts` |
| 5 Figures + mock | n/a | component work |

That would take SAT from 80 to ~170 templates, all four domains covered, with SPR at the real share.
