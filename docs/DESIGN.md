# CalmExam design system: "Still Water"

Calm, paper-like, focused. One problem at a time. The app and calmexam.com share these tokens.

## Principles
- **Calm over hype.** No confetti, no red badges, no countdown pressure. Celebrate with a soft check and one line of copy.
- **If it's teal, you can tap it.** Primary teal is interaction only.
- **Amber is premium only**, at most once per screen (trial, Pro badge).
- **Answers are always right.** Every answer is verified by the generator, so we show it plainly: "Verified answer".
- Depth comes from tonal steps and 1px borders. Soft shadows on web only, never heavy.

## Color
| Token | Hex | Use |
|---|---|---|
| `bg` | `#F5F3EE` | app / page background (warm paper) |
| `surface` | `#FFFFFF` | cards |
| `inset` | `#ECE8E0` | inputs, unselected options |
| `border` | `#E0DBD1` | 1px card / option borders |
| `ink` | `#1E2A2F` | primary text |
| `inkMuted` | `#5D6A70` | secondary text |
| `inkFaint` | `#8C979C` | captions, placeholders |
| `primary` | `#2E6E68` | buttons, links, selected state |
| `primaryPressed` | `#245955` | pressed |
| `primarySoft` | `#DDEBE8` | selected option fill, chips |
| `amber` | `#C08A35` | premium / trial only |
| `amberSoft` | `#F5E9D3` | premium surface |
| `correct` | `#3B8A5A` / soft `#DFF0E5` | correct answer |
| `wrong` | `#B9553F` / soft `#F6E1DB` | wrong answer (never full-screen red) |
| `night` | `#16201F` | dark hero band on web, dark mode bg |

## Type
- App: system font (SF Pro / Roboto). Titles 28/34 semibold, H2 22/28 semibold, body 17/24 regular, caption 13/18.
- Web: headings `Fraunces` (serif, 600), body `Inter` (400/600). Fallback to system fonts.
- Math uses tabular figures and the real minus sign (−).

## Shape and spacing
- Radii: card 20, option 16, input 14, chip 999, phone frame 44.
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48.
- Primary button: full width, 56 high, radius 16, teal fill, white 17 semibold.

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
