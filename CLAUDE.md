# CalmExam: Claude Code guidelines

CalmExam is a calm exam-practice app (SAT Math, AP Calculus AB, A-Level Maths) built with **Expo SDK 56 (React Native + TypeScript)** for iOS, Android and web. Read `docs/DESIGN.md` ("Riverstone") before touching UI and `docs/API.md` before touching networking.

## Rules

- **TypeScript only.** No `.js` files except tooling config (`eslint.config.js`).
- **No comments in code** unless explicitly asked.
- **Theme tokens only.** Colors, type, spacing and radii come from `src/theme/`. Never hardcode hex values or font sizes in screens.
- **Teal is interactive, amber is premium** (max once per screen), wrong answers use the soft rust tone, never full-screen red. No confetti, no countdown pressure.
- **Answers come from the engine.** Never let the API or a model decide the correct answer. `src/engine/` is shared with the Worker in `web/`; treat it as read-only here and report bugs instead of patching them in the app.
- **Every screen must work on web.** Guard native-only APIs with `Platform.OS` or a `.web.ts` sibling (see `purchases`, `haptics`, `confirm`, `demo`). `Alert` does nothing on web, so use `services/confirm`.
- **Pre-permission screens use a neutral "Continue" CTA**, never a custom "Allow" button.
- Free tier: unlimited practice. Pro: unlimited "Explain my mistake" (free gets 3/day) and the full plan.
- Stores are React Contexts persisted with AsyncStorage (`src/store/`). Keys live in `src/services/storage.ts`.
- Keep the `?demo=<id>` web states (`src/services/demoSeed.ts`, `App.tsx`) working when you change screens. CI screenshots depend on them and on `data-testid="screen-ready"`.
- `web/` is the Cloudflare Worker for calmexam.com (site + API). Pushes to `main` auto-deploy it through Cloudflare Workers Builds; see `web/README.md`.

## Checks (run after changes)

```
npx tsc --noEmit
npx expo lint
npm run verify:engine
npx expo export --platform web
```
