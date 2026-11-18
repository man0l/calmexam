// Bundles src/index.ts (+ ../src/engine) into ONE self-contained ES module: dist/worker.js
// Badges are inlined (.svg as text, .png as binary). App screenshots and og.png are NOT inlined:
// assets/screens/manifest.json lists which exist. The Worker reads it from GitHub at RUNTIME (src/manifest.ts);
// the copy read here at build time is only the fallback. The Worker proxies the PNGs from GitHub.
//   { "screens": ["exam", "plan"], "og": true, "version": "<git sha or date>" }
import { build } from 'esbuild';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SCREEN_IDS = ['exam', 'placement', 'plan', 'answer', 'explain', 'today'];
const OUT = process.env.OUTFILE || join(here, 'dist/worker.js');
const MAX_BYTES = 1.5 * 1024 * 1024;

function readManifest() {
  const file = process.env.SCREENS_MANIFEST || join(here, 'assets/screens/manifest.json'); // env override used by smoke test
  if (!existsSync(file)) return { screens: [], og: false, version: '' };
  const m = JSON.parse(readFileSync(file, 'utf8'));
  const screens = Array.isArray(m.screens) ? m.screens.filter((id) => SCREEN_IDS.includes(id)) : [];
  const version = String(m.version ?? '').replace(/[^\w.-]/g, '').slice(0, 40);
  return { screens, og: m.og === true, version };
}

const manifestPlugin = {
  name: 'virtual-screens',
  setup(b) {
    b.onResolve({ filter: /^virtual:screens$/ }, () => ({ path: 'screens', namespace: 'virtual' }));
    b.onLoad({ filter: /.*/, namespace: 'virtual' }, () => {
      const m = readManifest();
      if (m.screens.length || m.og) console.log(`manifest: screens=[${m.screens.join(', ')}] og=${m.og} v=${m.version}`);
      return { contents: `export const SCREEN_MANIFEST = ${JSON.stringify(m)};`, loader: 'js' };
    });
  },
};

mkdirSync(join(here, 'dist'), { recursive: true });
await build({
  entryPoints: [join(here, 'src/index.ts')],
  outfile: OUT,
  bundle: true,
  format: 'esm',
  target: 'es2022',
  platform: 'neutral',
  mainFields: ['module', 'main'],
  conditions: ['workerd', 'worker', 'browser'],
  minify: true,
  legalComments: 'none',
  loader: { '.svg': 'text', '.png': 'binary' },
  plugins: [manifestPlugin],
  logLevel: 'warning',
});

const size = statSync(OUT).size;
console.log(`${OUT.split('/').pop()} ${(size / 1024).toFixed(1)} KiB`);
if (size > MAX_BYTES) {
  console.error(`bundle exceeds ${MAX_BYTES} bytes`);
  process.exit(1);
}
