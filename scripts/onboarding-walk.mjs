import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const DIST = resolve(process.env.DIST_DIR ?? 'dist');
const OUT = resolve(process.env.OUT_DIR ?? 'onboarding-walk');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const DEVICES = [
  { name: 'iphone', width: 390, height: 844, insets: '47,0,34,0' },
  { name: 'android', width: 360, height: 780, insets: '24,0,16,0' },
];

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

await new Promise((r) => server.listen(4174, r));
const browser = await chromium.launch();
for (const d of DEVICES) {
  await mkdir(join(OUT, d.name), { recursive: true });
  const context = await browser.newContext({ viewport: { width: d.width, height: d.height }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(`http://localhost:4174/?demo=onboarding&insets=${d.insets}`, { waitUntil: 'networkidle' });
  let n = 0;
  const shot = async (label) => {
    await page.waitForTimeout(700);
    n += 1;
    await page.screenshot({ path: join(OUT, d.name, `${String(n).padStart(2, '0')}-${label}.png`) });
    console.log(`${d.name} ${n} ${label}`);
  };
  await shot('welcome');
  await page.getByTestId('welcome-start').click();
  await shot('exam');
  await page.getByTestId('exam-sat').click();
  await page.getByTestId('date-other').waitFor();
  await shot('date');
  await page.getByTestId('date-other').click();
  await shot('date-calendar');
  await page.getByLabel('Back').click();
  await page.locator('[data-testid^="date-2"]').first().click();
  await page.getByTestId('placement-option-0').waitFor();
  for (let q = 0; q < 5; q += 1) {
    await shot(`placement-q${q + 1}`);
    await page.getByTestId(`placement-option-${q % 2}`).click();
    await page.waitForTimeout(500);
  }
  await shot('plan');
  await page.getByTestId('onboarding-continue').click();
  await page.getByTestId('paywall-subscribe').waitFor();
  await shot('paywall');
  await page.getByTestId('paywall-subscribe').click();
  await shot('after-purchase');
  await context.close();
}
await browser.close();
server.close();
