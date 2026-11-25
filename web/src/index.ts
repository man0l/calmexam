import appStoreBadge from '../assets/badges/app-store-badge.svg';
import googlePlayBadge from '../assets/badges/google-play-badge.png';
import { withAIBotTracking } from 'indiestack-ai-bots';
import { CORS, handleExplain, handleHealth, handleProblems, handleWaitlist, json } from './api';
import type { Env } from './env';
import { hubPage, topicPage } from './html/exam-pages';
import { landingPage } from './html/landing';
import { homePage } from './html/home';
import { INDIESTACK_ORIGIN, INDIESTACK_SITE, LOGO_SVG } from './html/layout';
import { notFoundPage, privacyPage, termsPage } from './html/legal';
import { hasOg, hasScreenPng } from './html/screens';
import { RAW_BASE, activeManifest, loadManifest, setActiveManifest } from './manifest';
import { CONTENT_UPDATED } from './content';
import { ORIGIN, allPaths, daySeed, findHub, findLanding, findTopic } from './site';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy':
    `default-src 'self'; script-src 'self' 'unsafe-inline' ${INDIESTACK_ORIGIN}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' ${INDIESTACK_ORIGIN}; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`,
};

function html(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': status === 200 ? 'public, max-age=600' : 'public, max-age=60',
      ...SECURITY_HEADERS,
    },
  });
}

function asset(body: BodyInit, type: string): Response {
  return new Response(body, {
    headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' },
  });
}

function text(body: string, type: string): Response {
  return new Response(body, { headers: { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'public, max-age=3600' } });
}

// lastmod is the date the page content last changed, not today: the core sets are fixed, only the daily set rotates.
function sitemap(): string {
  const urls = allPaths()
    .map((p) => {
      const legal = p === '/privacy' || p === '/terms';
      const pri = p === '/' ? '1.0' : legal ? '0.2' : findHub(p) ? '0.9' : findLanding(p) ? '0.8' : '0.7';
      const freq = legal ? 'yearly' : 'weekly';
      return `<url><loc>${ORIGIN}${p}</loc><lastmod>${CONTENT_UPDATED}</lastmod><changefreq>${freq}</changefreq><priority>${pri}</priority></url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const ROBOTS = `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`;

async function handleApi(req: Request, env: Env, url: URL): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  const route = url.pathname.replace(/\/+$/, '');
  try {
    if (route === '/api/health' && req.method === 'GET') return handleHealth();
    if (route === '/api/problems' && req.method === 'GET') return handleProblems(url);
    if (route === '/api/waitlist' && req.method === 'POST') return await handleWaitlist(req, env);
    if (route === '/api/explain' && req.method === 'POST') return await handleExplain(req, env);
    if (['/api/health', '/api/problems', '/api/waitlist', '/api/explain'].includes(route)) {
      return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'GET, POST, OPTIONS' });
    }
    return json({ ok: false, error: 'not_found' }, 404);
  } catch (err) {
    console.error('api error', route, String(err));
    return json({ ok: false, error: 'server_error' }, 500);
  }
}

const app = {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (url.hostname === 'www.calmexam.com') {
      return Response.redirect(`${ORIGIN}${url.pathname}${url.search}`, 301);
    }
    if (url.pathname.startsWith('/api/') || url.pathname === '/api') return handleApi(req, env, url);

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    let path = url.pathname;
    if (path.length > 1 && path.endsWith('/')) {
      path = path.replace(/\/+$/, '');
      return Response.redirect(`${url.origin}${path}${url.search}`, 301);
    }

    setActiveManifest(await loadManifest());
    const shot = path.match(/^\/screens\/([a-z]+)\.png$/);
    const proxied = shot && hasScreenPng(shot[1]) ? `screens/${shot[1]}.png` : path === '/og.png' && hasOg() ? 'og.png' : null;
    const res = proxied ? await proxyAsset(proxied) : route(path, url);
    const headers = new Headers(res.headers);
    // Only calmexam.com should be indexed (workers.dev / previews keep canonical links but add noindex).
    if (url.hostname !== 'calmexam.com') headers.set('X-Robots-Tag', 'noindex');
    return new Response(req.method === 'HEAD' ? null : res.body, { status: res.status, headers });
  },
};

// indiestack: server-side AI bot tracking (GPTBot, ClaudeBot, Perplexity...). Never blocks or alters the response;
// it finds ctx.waitUntil in the args itself. (Its typings take one rest type, hence unknown[].)
export default {
  fetch: withAIBotTracking((req: Request, ...rest: unknown[]) => app.fetch(req, rest[0] as Env), { websiteId: INDIESTACK_SITE }),
} satisfies ExportedHandler<Env>;

/** Proxies an allow-listed image (manifest ids only, never user-controlled URLs) from the GitHub repo. */
async function proxyAsset(file: string): Promise<Response> {
  try {
    // The manifest version is part of the upstream URL so Cloudflare's edge cache (keyed on the URL) refreshes
    // when new screenshots land; raw.githubusercontent.com ignores the query string.
    const v = encodeURIComponent(activeManifest().version || '1');
    const upstream = await fetch(`${RAW_BASE}${file}?v=${v}`, { cf: { cacheTtl: 86400, cacheEverything: true } } as RequestInit);
    if (!upstream.ok) {
      return new Response('Not found', { status: upstream.status === 404 ? 404 : 502, headers: { 'Cache-Control': 'public, max-age=60' } });
    }
    return new Response(upstream.body, {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch {
    return new Response('Bad gateway', { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}

function route(path: string, url: URL): Response {
  switch (path) {
    case '/': {
      const err = url.searchParams.get('error');
      const state = url.searchParams.get('joined') === '1' ? 'joined' : err === 'server' ? 'server' : err ? 'error' : undefined;
      return html(homePage(daySeed(), state));
    }
    case '/privacy':
      return html(privacyPage());
    case '/terms':
      return html(termsPage());
    case '/robots.txt':
      return text(ROBOTS, 'text/plain');
    case '/sitemap.xml':
      return text(sitemap(), 'application/xml');
    case '/favicon.svg':
      return asset(LOGO_SVG.replace(' aria-hidden="true"', ''), 'image/svg+xml');
    case '/favicon.ico':
      return Response.redirect(`${url.origin}/favicon.svg`, 301);
    case '/assets/badges/app-store-badge.svg':
      return asset(appStoreBadge, 'image/svg+xml');
    case '/assets/badges/google-play-badge.png':
      return asset(googlePlayBadge, 'image/png');
  }
  const hub = findHub(path);
  if (hub) return html(hubPage(hub, daySeed()));
  const landing = findLanding(path);
  if (landing) return html(landingPage(landing, daySeed()));
  const topic = findTopic(path);
  if (topic) return html(topicPage(topic, daySeed()));
  return html(notFoundPage(), 404);
}
