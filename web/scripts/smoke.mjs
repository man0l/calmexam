// Smoke test for the built worker (dist/worker.js) in plain Node, without wrangler/workerd.
// Usage: npm run build && node scripts/smoke.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// Build a copy with an empty build-time manifest so the "no manifest" checks don't depend on committed screenshots.
const emptyManifest = join(here, '../dist/empty-manifest.json');
const smokeOut = join(here, '../dist/worker-smoke.js');
mkdirSync(join(here, '../dist'), { recursive: true });
writeFileSync(emptyManifest, JSON.stringify({ screens: [], og: false, version: '' }));
execFileSync(process.execPath, [join(here, '../build.mjs')], { env: { ...process.env, SCREENS_MANIFEST: emptyManifest, OUTFILE: smokeOut }, stdio: 'ignore' });
const worker = (await import(pathToFileURL(smokeOut).href)).default;
const previewDir = join(here, '../dist/preview');
mkdirSync(previewDir, { recursive: true });

// Minimal in-memory D1 stub: supports the waitlist INSERT ... ON CONFLICT(email) DO NOTHING.
function fakeDb() {
  const rows = new Map();
  return {
    rows,
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              if (!/^INSERT INTO waitlist/i.test(sql)) throw new Error('unexpected sql ' + sql);
              const [email, exam, platform, source, country] = args;
              if (rows.has(email)) return { success: true, meta: { changes: 0 } };
              rows.set(email, { email, exam, platform, source, country, created_at: new Date().toISOString() });
              return { success: true, meta: { changes: 1 } };
            },
            async first() { return null; },
            async all() { return { results: [...rows.values()] }; },
          };
        },
      };
    },
  };
}

const aiCalls = [];
const env = {
  DB: fakeDb(),
  AI: { run: async (model) => { aiCalls.push(model); throw new Error('AI unavailable (stub)'); } },
};

// Global fetch stub: the Worker fetches the screens manifest and proxied PNGs from GitHub.
const upstream = { manifest: null, manifestThrows: false };
const fetched = [];
globalThis.fetch = async (input, init) => {
  const u = String(input instanceof Request ? input.url : input);
  fetched.push({ u, cf: init?.cf });
  if (u.endsWith('/screens/manifest.json')) {
    if (upstream.manifestThrows) throw new Error('network down (stub)');
    return upstream.manifest ? Response.json(upstream.manifest) : new Response('404: Not Found', { status: 404 });
  }
  if (u.split('?')[0].endsWith('/exam.png')) return new Response('missing', { status: 404 });
  return new Response(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), { headers: { 'content-type': 'text/plain' } });
};

let failed = 0;
let passed = 0;
function check(name, cond, extra = '') {
  if (cond) passed++;
  else {
    failed++;
    console.log(`FAIL ${name} ${extra}`);
  }
}

async function call(path, init = {}, host = 'calmexam.com') {
  const req = new Request(`https://${host}${path}`, { redirect: 'manual', ...init });
  if (init.cf) Object.defineProperty(req, 'cf', { value: init.cf });
  return worker.fetch(req, env);
}

const countProblems = (h) => (h.match(/<li class="problem" data-id="[a-z]/g) || []).length;
const prompts = (h) => [...h.matchAll(/<p class="prompt">([^<]*)<\/p>/g)].map((m) => m[1]);
const noDupes = (h) => new Set(prompts(h)).size === prompts(h).length;
const PAGE_PROBLEMS = 25;

// Home
{
  const r = await call('/');
  const h = await r.text();
  check('home 200', r.status === 200);
  check('home waitlist form', h.includes('action="/api/waitlist"') && h.includes('name="email"') && h.includes('name="platform"'));
  check('home badges', h.includes('/assets/badges/app-store-badge.svg') && h.includes('/assets/badges/google-play-badge.png') && h.includes('Android coming soon'));
  check('home app store link', h.includes('https://apps.apple.com/app/calmexam/id6836514358') && h.includes('<meta name="apple-itunes-app" content="app-id=6836514358">'));
  check('home 3 problems', countProblems(h) === 3, String(countProblems(h)));
  check('home gallery 6 screens', (h.match(/<figure>/g) || []).length === 6);
  check('home cache header', r.headers.get('cache-control') === 'public, max-age=600');
  check('home FAQ JSON-LD', h.includes('"FAQPage"'));
  writeFileSync(join(previewDir, 'home.html'), h);
  const j = await (await call('/?joined=1')).text();
  check('home joined message', j.includes("you're on the list"));
}

// Hubs + topics
const sitemapRes = await call('/sitemap.xml');
const sitemap = await sitemapRes.text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check('sitemap 200', sitemapRes.status === 200 && sitemapRes.headers.get('content-type').includes('xml'));
const hubs = ['/sat-math-practice-test', '/ap-calculus-practice-test', '/a-level-maths-practice-questions'];
const topicLocs = locs.filter((l) => l.endsWith('-practice-problems'));
check('sitemap has 36 topics', topicLocs.length === 36, String(topicLocs.length));
check('sitemap lastmod is fixed', [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].every((m) => m[1] === '2026-11-25'));
const landings = ['/sat-math-questions', '/hard-sat-math-questions', '/easy-sat-math-questions', '/desmos-sat-math', '/ap-calc-ab-frq', '/ap-calculus-ab-practice-questions', '/edexcel-a-level-maths-practice-questions', '/aqa-a-level-maths-practice-questions', '/ocr-a-level-maths-practice-questions'];
for (const p of landings) check(`sitemap lists ${p}`, locs.includes('https://calmexam.com' + p));
check('sitemap absolute https', locs.every((l) => l.startsWith('https://calmexam.com/')));
for (const p of [...hubs, '/privacy', '/terms', '/']) check(`sitemap lists ${p}`, locs.includes('https://calmexam.com' + (p === '/' ? '/' : p)));

for (const p of hubs) {
  const r = await call(p);
  const h = await r.text();
  check(`hub ${p} 200`, r.status === 200);
  check(`hub ${p} ${PAGE_PROBLEMS} problems`, countProblems(h) === PAGE_PROBLEMS, String(countProblems(h)));
  check(`hub ${p} no duplicate questions`, noDupes(h));
  check(`hub ${p} core set fixed`, prompts(h).slice(0, 15).join() === prompts(await (await call(p)).text()).slice(0, 15).join());
  check(`hub ${p} schema`, h.includes('"Quiz"') && h.includes('"FAQPage"') && h.includes(`<link rel="canonical" href="https://calmexam.com${p}">`));
  writeFileSync(join(previewDir, p.slice(1) + '.html'), h);
}
let topicOk = 0;
for (const loc of topicLocs) {
  const p = loc.replace('https://calmexam.com', '');
  const r = await call(p);
  const h = await r.text();
  const ok = r.status === 200 && countProblems(h) === PAGE_PROBLEMS && noDupes(h) && h.includes('"Quiz"') && h.includes('"FAQPage"') && h.includes('"BreadcrumbList"') && h.includes('Exam tip:');
  check(`topic ${p}`, ok, `${r.status} ${countProblems(h)}`);
  if (ok) topicOk++;
  if (p === '/sat-math/quadratics-practice-problems' || p === '/a-level-maths/mechanics-practice-problems') {
    writeFileSync(join(previewDir, p.slice(1).replace('/', '__') + '.html'), h);
  }
}

check('all topic pages', topicOk === topicLocs.length, `${topicOk}/${topicLocs.length}`);
for (const p of landings) {
  const r = await call(p);
  const h = await r.text();
  const ok = r.status === 200 && countProblems(h) === PAGE_PROBLEMS && noDupes(h) && h.includes('"FAQPage"') && h.includes('"BreadcrumbList"') && h.includes(`<link rel="canonical" href="https://calmexam.com${p}">`);
  check(`landing ${p}`, ok, `${r.status} ${countProblems(h)}`);
  writeFileSync(join(previewDir, p.slice(1) + '.html'), h);
}
{
  const h = await (await call('/hard-sat-math-questions')).text();
  check('hard page only stretch', (h.match(/<span class="lvl">(Warm-up|Core)<\/span>/g) || []).length === 0);
  const f = await (await call('/ap-calc-ab-frq')).text();
  check('frq page only frq', (f.match(/FRQ style<\/span><\/p>/g) || []).length === PAGE_PROBLEMS);
}

// Static-ish routes
{
  const r = await call('/robots.txt');
  const t = await r.text();
  check('robots', r.status === 200 && t.includes('Sitemap: https://calmexam.com/sitemap.xml'));
  const pr = await call('/privacy');
  const ph = await pr.text();
  check('privacy', pr.status === 200 && ph.includes('hello@calmexam.com') && ph.includes('Workers AI'));
  writeFileSync(join(previewDir, 'privacy.html'), ph);
  check('terms', (await call('/terms')).status === 200);
  const f = await call('/favicon.svg');
  check('favicon', f.status === 200 && f.headers.get('content-type') === 'image/svg+xml');
  const b1 = await call('/assets/badges/app-store-badge.svg');
  check('apple badge', b1.status === 200 && (await b1.text()).startsWith('<svg'));
  const b2 = await call('/assets/badges/google-play-badge.png');
  const bytes = new Uint8Array(await b2.arrayBuffer());
  check('google badge png', b2.status === 200 && bytes[1] === 0x50 && bytes.length === 4904, String(bytes.length));
  const nf = await call('/nope');
  const nfh = await nf.text();
  check('404', nf.status === 404 && nfh.includes('noindex'));
  writeFileSync(join(previewDir, '404.html'), nfh);
  const ch = await call('/c/sat-linear-solve/4821');
  const chh = await ch.text();
  check('challenge 200', ch.status === 200 && countProblems(chh) === 1 && chh.includes('data-share') && chh.includes('noindex'));
  check('challenge stable', chh === (await (await call('/c/sat-linear-solve/4821')).text()));
  writeFileSync(join(previewDir, 'challenge.html'), chh);
  check('challenge unknown template 404', (await call('/c/nope-template/12')).status === 404);
  check('challenge bad seed 404', (await call('/c/sat-linear-solve/abc')).status === 404);
  const www = await call('/sat-math-practice-test?x=1', {}, 'www.calmexam.com');
  check('www redirect', www.status === 301 && www.headers.get('location') === 'https://calmexam.com/sat-math-practice-test?x=1');
  const slash = await call('/privacy/');
  check('trailing slash redirect', slash.status === 301 && slash.headers.get('location') === 'https://calmexam.com/privacy');
  const ico = await call('/favicon.ico');
  check('favicon.ico redirect', ico.status === 301);
  const dev = await call('/', {}, 'calmexam.example.workers.dev');
  check('workers.dev noindex', dev.status === 200 && dev.headers.get('x-robots-tag') === 'noindex');
  const head = await call('/sat-math-practice-test', { method: 'HEAD' });
  check('HEAD', head.status === 200 && (await head.text()) === '');
  check('apex indexable', (await call('/')).headers.get('x-robots-tag') === null);
}

// API
const postJson = (path, body) =>
  call(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), cf: { country: 'GB' } });
{
  const h = await call('/api/health');
  const hj = await h.json();
  check('health', h.status === 200 && hj.ok === true && hj.templates > 0, JSON.stringify(hj));
  check('api no-store + cors', h.headers.get('cache-control') === 'no-store' && h.headers.get('access-control-allow-origin') === '*');
  const opt = await call('/api/waitlist', { method: 'OPTIONS' });
  check('options 204', opt.status === 204 && opt.headers.get('access-control-allow-methods').includes('POST'));

  const good = await postJson('/api/waitlist', { email: '  Student@Example.COM ', exam: 'sat', platform: 'ios', source: 'smoke' });
  const gj = await good.json();
  check('waitlist good', good.status === 200 && gj.ok && gj.already === false, JSON.stringify(gj));
  const row = env.DB.rows.get('student@example.com');
  check('waitlist stored lowercased + country', row && row.country === 'GB' && row.exam === 'sat' && row.platform === 'ios');
  const dup = await postJson('/api/waitlist', { email: 'student@example.com' });
  const dj = await dup.json();
  check('waitlist duplicate', dup.status === 200 && dj.ok && dj.already === true, JSON.stringify(dj));
  const bad = await postJson('/api/waitlist', { email: 'not-an-email' });
  const bj = await bad.json();
  check('waitlist bad', bad.status === 400 && bj.error === 'invalid_email', JSON.stringify(bj));
  const long = await postJson('/api/waitlist', { email: 'a'.repeat(250) + '@x.com' });
  check('waitlist too long', long.status === 400);
  const form = await call('/api/waitlist', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'email=form%40example.com&exam=a-level&platform=android&source=home-hero',
  });
  check('waitlist form 303', form.status === 303 && form.headers.get('location') === '/?joined=1#join', `${form.status} ${form.headers.get('location')}`);
  check('waitlist form stored', env.DB.rows.has('form@example.com'));
  const formBad = await call('/api/waitlist', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'email=nope' });
  check('waitlist form bad 303', formBad.status === 303 && formBad.headers.get('location').includes('error'));

  const pr = await call('/api/problems?exam=sat&topic=sat-quadratics&count=10&seed=123');
  const pj = await pr.json();
  check('problems', pr.status === 200 && pj.problems.length === 10 && pj.problems.every((p) => p.topicId === 'sat-quadratics'));
  const max = await (await call('/api/problems?exam=a-level&count=99')).json();
  check('problems max 20', max.problems.length === 20);
  check('problems bad exam 400', (await call('/api/problems?exam=gcse')).status === 400);

  const p = pj.problems[0];
  const wrong = p.choices.find((c) => c !== p.answer);
  const ex = await postJson('/api/explain', { problemId: p.id, chosen: wrong, question: 'why? '.repeat(200) });
  const ej = await ex.json();
  check('explain fallback', ex.status === 200 && ej.ok && ej.source === 'steps' && ej.answer === p.answer && ej.explanation.includes(p.answer), JSON.stringify(ej));
  check('explain tried both models', aiCalls.join(',') === '@cf/meta/llama-3.1-8b-instruct-fast,@cf/meta/llama-3.1-8b-instruct', aiCalls.join(','));
  const generic = await (await postJson('/api/explain', { problemId: p.id, chosen: 'definitely not a choice' })).json();
  check('explain generic', generic.ok && generic.answer === p.answer);
  const bogus = await postJson('/api/explain', { problemId: 'nope:1', chosen: '1' });
  check('explain bogus 400', bogus.status === 400 && (await bogus.json()).error === 'unknown_problem');
  const bogus2 = await postJson('/api/explain', { problemId: 'sat-linear-solve:abc', chosen: '1' });
  check('explain bad seed 400', bogus2.status === 400);
  console.log('sample fallback explanation:\n  ' + ej.explanation.replace(/\n/g, '\n  '));

  // AI success path with a stub model
  const okEnv = { ...env, AI: { run: async () => ({ response: 'You flipped the sign. Follow step 2.' }) } };
  const r = await worker.fetch(
    new Request('https://calmexam.com/api/explain', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ problemId: p.id, chosen: wrong }) }),
    okEnv,
  );
  const rj = await r.json();
  check('explain ai path', rj.source === 'ai' && rj.answer === p.answer);
  check('api unknown 404', (await call('/api/nope')).status === 404);
}

// Screenshot/og: runtime manifest from GitHub (stubbed fetch), memoized ~5 min, build-time fallback.
{
  const realNow = Date.now;
  const advance = (() => { let off = 0; Date.now = () => realNow() + off; return (ms) => { off += ms; }; })();
  const get = (w, p) => w.fetch(new Request('https://calmexam.com' + p), env);
  const phones = (h) => (h.match(/class="phone"/g) || []).length;

  // 1) No manifest upstream (404, the default stub) -> mockups only, no og:image, /screens 404
  advance(10 * 60 * 1000);
  {
    const h = await (await call('/')).text();
    check('no manifest: mockups', !h.includes('/screens/') && phones(h) === 7);
    check('no manifest: no og:image', !h.includes('og:image'));
    check('no manifest: /screens 404', (await call('/screens/plan.png')).status === 404 && (await call('/og.png')).status === 404);
  }

  // 2) Runtime manifest appears -> picked up after the memo expires, no rebuild
  upstream.manifest = { screens: ['plan', 'exam', 'bogus'], og: true, version: 'abc123' };
  advance(10 * 60 * 1000);
  fetched.length = 0;
  {
    const h = await (await call('/')).text();
    const mf = fetched.find((f) => f.u.endsWith('/screens/manifest.json'));
    check('runtime manifest fetched with cf', mf?.u === 'https://raw.githubusercontent.com/man0l/calmexam/main/web/assets/screens/manifest.json' && mf.cf?.cacheTtl === 600 && mf.cf?.cacheEverything === true);
    check('runtime: img for plan/exam', h.includes('src="/screens/plan.png?v=abc123"') && h.includes('src="/screens/exam.png?v=abc123"'));
    check('runtime: other mockups kept', phones(h) === 5);
    check('runtime: og:image', h.includes('<meta property="og:image" content="https://calmexam.com/og.png?v=abc123">'));
    await call('/privacy');
    check('runtime: memoized', fetched.filter((f) => f.u.endsWith('manifest.json')).length === 1);
    fetched.length = 0;
    const r = await call('/screens/plan.png?v=abc123');
    check('proxy plan 200', r.status === 200 && r.headers.get('content-type') === 'image/png' && r.headers.get('cache-control') === 'public, max-age=86400');
    check('proxy upstream url + cf', fetched[0]?.u === 'https://raw.githubusercontent.com/man0l/calmexam/main/web/assets/screens/plan.png?v=abc123' && fetched[0]?.cf?.cacheTtl === 86400 && fetched[0]?.cf?.cacheEverything === true);
    check('proxy 404 passthrough', (await call('/screens/exam.png')).status === 404);
    const n = fetched.length;
    check('proxy not open', (await call('/screens/today.png')).status === 404 && (await call('/screens/bogus.png')).status === 404 && fetched.length === n);
    const og = await call('/og.png');
    check('proxy og', og.status === 200 && fetched.at(-1).u === 'https://raw.githubusercontent.com/man0l/calmexam/main/web/assets/og.png?v=abc123');
  }

  // 3) Build-time fallback: bundle with a manifest baked in, runtime fetch failing
  const tmp = join(here, '../dist/test-manifest.json');
  const out = join(here, '../dist/worker-manifest-test.js');
  writeFileSync(tmp, JSON.stringify({ screens: ['today'], og: false, version: 'build1' }));
  execFileSync(process.execPath, [join(here, '../build.mjs')], { env: { ...process.env, SCREENS_MANIFEST: tmp, OUTFILE: out } });
  const w2 = (await import(pathToFileURL(out).href)).default;
  upstream.manifestThrows = true;
  {
    const h = await (await get(w2, '/')).text();
    check('fallback: build-time manifest', h.includes('src="/screens/today.png?v=build1"') && phones(h) === 6 && !h.includes('og:image'));
  }
  upstream.manifestThrows = false;
  rmSync(tmp); rmSync(out);
  Date.now = realNow;
}

console.log(`topics ok: ${topicOk}/${topicLocs.length}`);
console.log(`smoke: ${passed} passed, ${failed} failed`);
console.log(`previews written to dist/preview/`);
process.exit(failed ? 1 : 0);
