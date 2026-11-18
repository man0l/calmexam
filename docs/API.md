# CalmExam API (Cloudflare Worker `calmexam`, folder `web/`)

The same Worker serves the website (calmexam.com) and the JSON API.
Base URLs: `https://calmexam.com/api` and `https://calmexam.manol-trendafilov.workers.dev/api` (the app uses the workers.dev hostname via `EXPO_PUBLIC_API_BASE_URL`).

All endpoints accept and return JSON and send CORS headers (`Access-Control-Allow-Origin: *`, methods `GET, POST, OPTIONS`).

## `GET /api/health`
`{ "ok": true, "templates": 35 }`

## `POST /api/waitlist`
Body: `{ "email": string, "exam"?: "sat" | "ap-calc-ab" | "a-level" | "other", "platform"?: "ios" | "android" | "both", "source"?: string }`
- Validates the email, stores it in D1 table `waitlist` (unique on lowercased email; a repeat signup is not an error).
- 200 `{ "ok": true, "already": boolean }`, 400 `{ "ok": false, "error": "invalid_email" }`.

## `POST /api/explain`
Body: `{ "problemId": string, "chosen": string, "question"?: string }`
- `problemId` is `"<templateId>:<seed>"` (from `Problem.id`). The Worker regenerates the problem with `problemFromId()` from `src/engine`, so the correct answer and steps come from the server-side generator, never from the client or the model.
- The model (Workers AI binding `AI`) only narrates *why* `chosen` is wrong, using the verified answer, steps and pitfalls. If the model fails or is unavailable, the Worker returns a deterministic explanation built from the steps and pitfalls.
- 200 `{ "ok": true, "explanation": string, "answer": string, "source": "ai" | "steps" }`, 400 `{ "ok": false, "error": "unknown_problem" }`.

## `GET /api/problems?exam=sat&topic=<topicId>&count=10&seed=123`
Returns `{ "problems": Problem[] }` (max 20). Used by web practice widgets.
