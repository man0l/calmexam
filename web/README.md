# calmexam.com (website + API, one Cloudflare Worker)

The Worker `calmexam` serves the marketing site, the SEO practice pages and the JSON API
(`docs/API.md`). Problems come from the shared engine in `../src/engine`, bundled in by esbuild.

## Structure
```
web/
  build.mjs              esbuild: src/index.ts -> dist/worker.js (ONE self-contained ES module)
  wrangler.jsonc         name calmexam, no_bundle (uses dist/worker.js), AI + D1 bindings, custom domains
  migrations/0001_waitlist.sql
  assets/badges/         official store badges (inlined into the bundle, served at /assets/badges/*)
  assets/screens/        optional {exam,placement,plan,answer,explain,today}.png + manifest.json
                         {"screens":["plan",...],"og":true,"version":"<sha>"}. Listed ids replace the HTML
                         mockups with <img src="/screens/{id}.png?v=version">; the Worker proxies them (and
                         /og.png from assets/og.png) from raw.githubusercontent.com/man0l/calmexam/main/web/assets/.
                         Not inlined. The manifest is read at RUNTIME from GitHub (edge cache 10 min, memo 5 min),
                         so committing PNGs + manifest updates the site with no redeploy; the build-time copy is
                         only a fallback. No manifest = HTML mockups and no og:image.
  src/index.ts           router: pages, assets, robots/sitemap, www -> apex 301, /api/*
  src/api.ts             /api/health, /api/problems, /api/waitlist (D1), /api/explain (Workers AI + fallback)
  src/site.ts            URLs: hubs /{exam.hubSlug}, topics /{sat-math|ap-calculus|a-level-maths}/{slug}-practice-problems
  src/content.ts         hub copy, FAQs, brand, CONTENT_UPDATED (sitemap lastmod)
  src/topic-copy/*       per-topic key idea, common mistakes, exam tip and FAQs
  src/landing.ts         keyword landing pages (SAT questions/hard/easy, Desmos, AP FRQ/MCQ, exam boards)
  src/html/*             layout + inlined CSS (styles.ts), inline client JS (client.ts), pages, phone mockups
  scripts/smoke.mjs      Node smoke test of dist/worker.js with fake D1/AI
```
Pages: `/`, 3 hubs, 9 landing pages, 36 topic pages, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, `/favicon.svg`, 404.
Practice pages render a fixed 15-question core set (constant seed, the same on every crawl) and, below it, a
10-question daily set (days since epoch) that never repeats a core question. Bump `CONTENT_UPDATED` when copy or
the question bank changes. Pages are cached
`public, max-age=600`; API responses are `no-store`.

## Local development
```
npm install
npm run build              # -> dist/worker.js
npm run typecheck
node scripts/smoke.mjs     # no wrangler needed; writes dist/preview/*.html
npx wrangler d1 migrations apply calmexam --local
npm run dev                # wrangler dev (Workers AI needs remote; /api/explain falls back to steps locally)
```

## Deploy
- Wrangler (CI): `CLOUDFLARE_API_TOKEN=... npm run deploy` (runs the build, uploads `dist/worker.js`).
- Raw API: upload `dist/worker.js` as an ES module (`main_module: "worker.js"`) with bindings
  `{"type":"ai","name":"AI"}` and `{"type":"d1","name":"DB","id":"<database_id>"}`,
  compatibility_date `2026-11-01`; then attach custom domains `calmexam.com` and `www.calmexam.com`.

## D1
Database `calmexam` (id in `wrangler.jsonc`). Apply the schema:
```
npx wrangler d1 migrations apply calmexam --remote     # or: npm run db:migrate
npx wrangler d1 execute calmexam --remote --command "SELECT count(*) FROM waitlist"
```
