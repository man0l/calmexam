// Renders every demo screen with fake device safe-area insets (?insets=) and
// fails if any visible text, icon or button sits under the status bar, notch /
// Dynamic Island, home indicator, Android nav bar or a landscape side cutout.
// Writes annotated screenshots (unsafe bands in red) and report.json to OUT_DIR.
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, mkdir, stat, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const DIST = resolve(process.env.DIST_DIR ?? 'dist');
const OUT = resolve(process.env.OUT_DIR ?? 'safe-area-audit');
const SCREENS = ['onboarding', 'exam', 'placement', 'plan', 'today', 'practice', 'progress', 'settings', 'answer', 'explain', 'paywall'];
// Insets in CSS px (= iOS pt / Android dp), [top, right, bottom, left].
const DEVICES = [
  { id: 'iphone16pro', w: 402, h: 874, ins: [62, 0, 34, 0], island: true, home: true },
  { id: 'iphoneSE', w: 375, h: 667, ins: [20, 0, 0, 0] },
  { id: 'pixel9-gesture', w: 412, h: 915, ins: [52, 0, 24, 0], punch: true, home: true },
  { id: 'pixel9-3button', w: 412, h: 915, ins: [52, 0, 48, 0], punch: true, buttons: true },
  { id: 'android-landscape', w: 915, h: 412, ins: [24, 0, 24, 48], cutoutLeft: true, home: true },
];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let file = join(DIST, decodeURIComponent(url.pathname));
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { file = join(DIST, 'index.html'); }
  try { res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' }); res.end(await readFile(file)); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(Number(process.env.PORT ?? 4174), r));
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const report = [];

for (const d of DEVICES) {
  const ctx = await browser.newContext({ viewport: { width: d.w, height: d.h }, deviceScaleFactor: 2 });
  for (const id of SCREENS) {
    const page = await ctx.newPage();
    await page.goto(`http://localhost:4174/?demo=${id}&insets=${d.ins.join(',')}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="screen-ready"]', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(700);
    // Every visible text / interactive element that intrudes into an unsafe band.
    const hits = await page.evaluate(([t, r, b, l]) => {
      const W = innerWidth, H = innerHeight, out = [];
      const els = document.querySelectorAll('body *');
      for (const el of els) {
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
        const interactive = el.getAttribute('role') === 'button' || el.tagName === 'BUTTON' || el.getAttribute('tabindex') === '0';
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        const isIcon = el.tagName === 'svg';
        if (!interactive && !hasText && !isIcon) continue;
        const raw = el.getBoundingClientRect();
        // Clip by every scrolling/overflow-hidden ancestor: content scrolled out of view is fine.
        let rc = { top: raw.top, bottom: raw.bottom, left: raw.left, right: raw.right };
        for (let a = el.parentElement; a; a = a.parentElement) {
          const o = getComputedStyle(a);
          if (o.overflow === 'visible' && o.overflowY === 'visible' && o.overflowX === 'visible') continue;
          const ar = a.getBoundingClientRect();
          rc = { top: Math.max(rc.top, ar.top), bottom: Math.min(rc.bottom, ar.bottom), left: Math.max(rc.left, ar.left), right: Math.min(rc.right, ar.right) };
        }
        rc.top = Math.max(rc.top, 0); rc.bottom = Math.min(rc.bottom, H); rc.left = Math.max(rc.left, 0); rc.right = Math.min(rc.right, W);
        if (rc.right - rc.left < 1 || rc.bottom - rc.top < 1) continue;
        // Skip elements covered by something else (e.g. a screen under the paywall).
        const cx = (rc.left + rc.right) / 2, cy = (rc.top + rc.bottom) / 2;
        const top = document.elementFromPoint(cx, cy);
        if (top && top !== el && !el.contains(top) && !top.contains(el)) continue;
        const bad = [];
        if (rc.top < t - 0.5) bad.push(`top ${Math.round(t - rc.top)}px`);
        if (rc.bottom > H - b + 0.5) bad.push(`bottom ${Math.round(rc.bottom - (H - b))}px`);
        if (rc.left < l - 0.5) bad.push(`left ${Math.round(l - rc.left)}px`);
        if (rc.right > W - r + 0.5) bad.push(`right ${Math.round(rc.right - (W - r))}px`);
        if (bad.length) out.push({ what: (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 40), bad: bad.join(', '), interactive });
      }
      return out;
    }, d.ins);
    // Draw hazard overlay: unsafe bands + hardware shapes.
    await page.evaluate(({ d }) => {
      const [t, r, b, l] = d.ins;
      const add = (css) => { const e = document.createElement('div'); e.style.cssText = 'position:fixed;pointer-events:none;z-index:99999;' + css; document.body.appendChild(e); };
      const band = 'background:rgba(220,40,40,.16);';
      if (t) add(`${band}top:0;left:0;right:0;height:${t}px;border-bottom:1px dashed rgba(220,40,40,.8)`);
      if (b) add(`${band}bottom:0;left:0;right:0;height:${b}px;border-top:1px dashed rgba(220,40,40,.8)`);
      if (l) add(`${band}top:0;bottom:0;left:0;width:${l}px;border-right:1px dashed rgba(220,40,40,.8)`);
      if (r) add(`${band}top:0;bottom:0;right:0;width:${r}px`);
      if (d.island) add(`top:11px;left:50%;transform:translateX(-50%);width:126px;height:37px;border-radius:20px;background:#000`);
      if (d.punch) add(`top:14px;left:50%;transform:translateX(-50%);width:22px;height:22px;border-radius:50%;background:#000`);
      if (d.cutoutLeft) add(`left:12px;top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:50%;background:#000`);
      if (d.home) add(`bottom:8px;left:50%;transform:translateX(-50%);width:${d.w > 600 ? 200 : 134}px;height:5px;border-radius:3px;background:#111`);
      if (d.buttons) {
        add(`bottom:0;left:0;right:0;height:${b}px;display:flex;justify-content:space-around;align-items:center;font:20px sans-serif;color:#333`);
        document.body.lastChild.textContent = '◁ ○ ▢';
      }
      add(`top:${Math.max(4, (t - 20) / 2)}px;left:${d.island ? 32 : 16}px;font:600 15px -apple-system,sans-serif;color:#111`);
      document.body.lastChild.textContent = '9:41';
    }, { d });
    await page.screenshot({ path: join(OUT, `${d.id}-${id}.png`) });
    report.push({ device: d.id, screen: id, hits });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
server.close();
await writeFile(join(OUT, 'report.json'), JSON.stringify(report, null, 2));
for (const r of report) console.log(`${r.device.padEnd(18)} ${r.screen.padEnd(11)} ${r.hits.length ? r.hits.map((h) => `[${h.what}: ${h.bad}]`).join(' ') : 'OK'}`);
const failed = report.filter((r) => r.hits.length);
if (failed.length) {
  console.error(`${failed.length} screen(s) have content inside an unsafe area`);
  process.exit(1);
}
