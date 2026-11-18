// Screens manifest: which gallery screenshots (and og.png) exist in the GitHub repo.
// Loaded at RUNTIME from GitHub (edge-cached 10 min + memoized ~5 min per isolate), so committing
// web/assets/screens/*.png + manifest.json updates the live site without a redeploy.
// Falls back to the build-time manifest (virtual:screens) on any failure; empty manifest = HTML mockups.
import { SCREEN_MANIFEST } from 'virtual:screens';

export const RAW_BASE = 'https://raw.githubusercontent.com/man0l/calmexam/main/web/assets/';
export const KNOWN_SCREENS = ['exam', 'placement', 'plan', 'answer', 'explain', 'today'];
const MEMO_MS = 5 * 60 * 1000;
const FAIL_MEMO_MS = 60 * 1000;

export interface Manifest {
  screens: string[];
  og: boolean;
  version: string;
}

/** Allow-list: only known screen ids survive; version is sanitized for use in URLs. */
export function normalizeManifest(raw: unknown): Manifest {
  const m = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const screens = Array.isArray(m.screens)
    ? KNOWN_SCREENS.filter((id) => (m.screens as unknown[]).includes(id))
    : [];
  const version = String(m.version ?? '').replace(/[^\w.-]/g, '').slice(0, 40);
  return { screens, og: m.og === true, version };
}

const BUILD_MANIFEST = normalizeManifest(SCREEN_MANIFEST);
let memo: { m: Manifest; until: number } | null = null;
let active: Manifest = BUILD_MANIFEST;

export async function loadManifest(now = Date.now()): Promise<Manifest> {
  if (memo && now < memo.until) return memo.m;
  let m = BUILD_MANIFEST;
  let ttl = FAIL_MEMO_MS;
  try {
    const res = await fetch(RAW_BASE + 'screens/manifest.json', {
      cf: { cacheTtl: 600, cacheEverything: true },
    } as RequestInit);
    if (res.ok) {
      m = normalizeManifest(await res.json());
      ttl = MEMO_MS;
    }
  } catch {
    // keep build-time manifest
  }
  memo = { m, until: now + ttl };
  return m;
}

/** Test hook: forget the memoized runtime manifest. */
export function resetManifestCache(): void {
  memo = null;
}

/** Set before synchronous rendering of a request (rendering never awaits, so this cannot interleave). */
export function setActiveManifest(m: Manifest): void {
  active = m;
}

export function activeManifest(): Manifest {
  return active;
}
