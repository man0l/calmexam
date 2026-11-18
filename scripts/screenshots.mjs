import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const DIST = resolve(process.env.DIST_DIR ?? 'dist');
const OUT = resolve(process.env.OUT_DIR ?? 'web/assets/screens');
const SCREENS = (process.env.SCREENS ?? 'exam,placement,plan,answer,explain,today,paywall').split(',');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let file = join(DIST, decodeURIComponent(url.pathname));
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch {
    file = join(DIST, 'index.html');
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});

await new Promise((r) => server.listen(4173, r));
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: 'light' });
const done = [];
for (const id of SCREENS) {
  const page = await context.newPage();
  await page.goto(`http://localhost:4173/?demo=${id}`, { waitUntil: 'networkidle' });
  try {
    await page.waitForSelector('[data-testid="screen-ready"]', { timeout: 15000 });
  } catch {
    console.warn(`screen ${id}: no screen-ready marker, capturing anyway`);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(OUT, `${id}.png`) });
  done.push(id);
  console.log(`captured ${id}`);
  await page.close();
}
await browser.close();
server.close();

const version = (process.env.GITHUB_SHA ?? new Date().toISOString()).slice(0, 12);
const manifestPath = join(OUT, 'manifest.json');
let manifest = {};
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch {}
await writeFile(manifestPath, JSON.stringify({ ...manifest, screens: done, version }, null, 2) + '\n');
console.log(`wrote ${manifestPath}`);
