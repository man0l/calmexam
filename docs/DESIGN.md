# CalmExam design system: "Riverstone"

Calm water, stepping stones, graph paper. The direction is "Brilliant-calm" (one bold hero per screen, tactile controls, illustration, a visible path), but every detail is CalmExam's own. The app and calmexam.com share these tokens.

## What makes it ours
- **Stepping-stone path.** Today shows your weakest topics as pebbles crossing to an "Exam day" flag, zig-zagging with dotted ripples. Not circles on a line: irregular pebbles, the current one ringed in mint with an "Up next" coral tag.
- **Lagoon hero with graph paper.** One deep lagoon card per screen (`HeroCard`) with a faint dot grid and a soft sine "water line". Only the hero is dark.
- **Paper-cut topic art.** Every topic has a pebble-shaped glyph (`TopicArt`) built from its own math: a parabola for quadratics, shaded area for integrals, a hole in a curve for limits, a pie for percentages. Pebble tints rotate mint, sand, coral.
- **Pebble-press controls.** Buttons, options, chips and cards sit on a 3–4px darker bottom edge and sink into it when pressed.
- **Lexend** for all text: a typeface designed for reading fluency, which suits a study app better than a generic geometric font.
- **Brand mark:** three stepping stones rising out of a lagoon tile.

## Principles
- **Calm over hype.** No confetti, no red badges, no countdown pressure. Celebrate with a soft check and one line of copy.
- **One hero per screen.** Everything else is white cards on mist.
- **If it's teal, you can tap it.** Primary teal is interaction only.
- **Amber is premium only**, at most once per screen (trial, Pro badge). Coral is the single "up next" accent.
- **Answers are always right.** Every answer is verified by the generator, so we show it plainly: "Verified answer".

## Color
| Token | Hex | Use |
|---|---|---|
| `bg` | `#F4F7F5` | mist background |
| `surface` | `#FFFFFF` | cards |
| `inset` / `border` / `edge` | `#E9EFEC` / `#DCE5E1` / `#CBD8D2` | inputs, 1.5px borders, tactile bottom edge |
| `ink` / `inkMuted` / `inkFaint` | `#10232A` / `#52656B` / `#8A9A9E` | text |
| `primary` / `primaryEdge` / `primarySoft` | `#147A6E` / `#0B5248` / `#D5EEE7` | buttons, selection |
| `lagoon` / `lagoonEdge` / `lagoonMuted` | `#0D3A36` / `#072624` / `#9CC9C0` | hero card, text on hero |
| `mint` / `sand` / `coral` | `#8FD8C4` / `#F2D9A9` / `#F2876A` | illustration, "up next" |
| `amber` / `amberSoft` | `#D9962B` / `#FAEBCD` | premium only |
| `correct` / `wrong` | `#2E9466` / `#C4553C` (soft `#DCF2E6` / `#F8E1DA`) | answers, never full-screen red |

## Type
- Lexend 400/500/600/700 (app via `@expo-google-fonts/lexend`, web via Google Fonts). Title 28/34 semibold, H2 22/28, body 16/24, caption 12/17, eyebrow 11 semibold +1.1 tracking.
- Math uses tabular figures and the real minus sign (−).

## Shape and spacing
- Radii: hero 28, card 24, option/button 18, input 14, chip 999.
- Tactile edge: buttons and options 4px, cards 3px, hero 5px.
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48.

## Patterns borrowed from the researched apps (App Store Tracker captured screens)
| Screen | Pattern | Source app |
|---|---|---|
| Exam picker | big option cards with an icon, region label, one tap selects | Danho |
| Exam date | calendar / date list, "days left" shown live | Flashka, GoPrep |
| Worries | multi-select chips: time, weak topics, test anxiety | GoPrep, Astra |
| Placement | 5 real questions, progress bar segmented in 5 | own |
| Projection | "with CalmExam vs on your own" two-line graph | Studley |
| Plan reveal | "Your 42-day plan" card: 3 weak topics, minutes per day | Brilliant, Koro |
| Paywall | goal recap + trial timeline (today / day 5 reminder / day 7) + plans | GoPrep, Gauth |
| Answer | verified answer, numbered steps, "common pitfalls" box | Gauth |
| Explain my mistake | chat-style card grounded in the template | Astra, Brilliant |
| Streak | daily goal ring + week strip + days to exam | LearnUp, WordPal |
