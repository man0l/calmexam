import { createHash, createPrivateKey, sign } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const BUNDLE_ID = process.env.BUNDLE_ID ?? 'com.balkanbit.calmexam';
const VERSION = process.env.VERSION ?? JSON.parse(await readFile('app.json', 'utf8')).expo.version;
const SUBMIT = process.env.SUBMIT === 'true';
const META = JSON.parse(await readFile(resolve('store/ios/metadata.json'), 'utf8'));
const SHOTS = resolve('store/ios/screenshots');
const DISPLAY = process.env.SCREENSHOT_DISPLAY_TYPE ?? 'APP_IPHONE_65';
const KEY_ID = process.env.APP_STORE_CONNECT_KEY_ID;
const ISSUER = process.env.APP_STORE_CONNECT_ISSUER_ID;
const KEY = Buffer.from(process.env.APP_STORE_CONNECT_API_KEY_BASE64 ?? '', 'base64').toString('utf8');
const API = 'https://api.appstoreconnect.apple.com';

if (!KEY_ID || !ISSUER || !KEY) throw new Error('App Store Connect API credentials are missing');

const b64url = (b) => Buffer.from(b).toString('base64url');
function token() {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' }));
  const body = b64url(JSON.stringify({ iss: ISSUER, iat: now, exp: now + 1100, aud: 'appstoreconnect-v1' }));
  const sig = sign('sha256', Buffer.from(`${head}.${body}`), { key: createPrivateKey(KEY), dsaEncoding: 'ieee-p1363' });
  return `${head}.${body}.${b64url(sig)}`;
}

async function asc(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
    method,
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function editableVersion(appId) {
  const list = await asc('GET', `/v1/apps/${appId}/appStoreVersions?filter[platform]=IOS&limit=20`);
  const found = list.data.find((v) => v.attributes.versionString === VERSION);
  if (found) return found;
  const open = list.data.find((v) => ['PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED'].includes(v.attributes.appStoreState));
  if (open) {
    const r = await asc('PATCH', `/v1/appStoreVersions/${open.id}`, { data: { type: 'appStoreVersions', id: open.id, attributes: { versionString: VERSION } } });
    return r.data;
  }
  const r = await asc('POST', '/v1/appStoreVersions', {
    data: {
      type: 'appStoreVersions',
      attributes: { platform: 'IOS', versionString: VERSION, releaseType: 'AFTER_APPROVAL' },
      relationships: { app: { data: { type: 'apps', id: appId } } },
    },
  });
  console.log(`created version ${VERSION}`);
  return r.data;
}

async function appInfoText(appId) {
  const infos = await asc('GET', `/v1/apps/${appId}/appInfos`);
  const live = new Set(['READY_FOR_DISTRIBUTION', 'READY_FOR_SALE']);
  const info = infos.data.find((i) => !live.has(i.attributes.appStoreState ?? i.attributes.state)) ?? infos.data[0];
  const locs = await asc('GET', `/v1/appInfos/${info.id}/appInfoLocalizations`);
  for (const [locale, m] of Object.entries(META)) {
    const attrs = { name: m.name, subtitle: m.subtitle };
    const ex = locs.data.find((l) => l.attributes.locale === locale);
    if (ex) await asc('PATCH', `/v1/appInfoLocalizations/${ex.id}`, { data: { type: 'appInfoLocalizations', id: ex.id, attributes: attrs } });
    else {
      const base = locs.data[0]?.attributes ?? {};
      await asc('POST', '/v1/appInfoLocalizations', {
        data: {
          type: 'appInfoLocalizations',
          attributes: { locale, ...attrs, privacyPolicyUrl: base.privacyPolicyUrl ?? 'https://calmexam.com/privacy' },
          relationships: { appInfo: { data: { type: 'appInfos', id: info.id } } },
        },
      });
    }
    console.log(`${locale}: name "${m.name}", subtitle "${m.subtitle}"`);
  }
}

async function versionText(versionId) {
  const locs = await asc('GET', `/v1/appStoreVersions/${versionId}/appStoreVersionLocalizations`);
  const base = locs.data.find((l) => l.attributes.locale === 'en-US')?.attributes ?? locs.data[0]?.attributes ?? {};
  const supportUrl = locs.data.map((l) => l.attributes.supportUrl).find(Boolean) ?? 'https://calmexam.com';
  const out = {};
  for (const [locale, m] of Object.entries(META)) {
    const attrs = { description: m.description, keywords: m.keywords, promotionalText: m.promotionalText, whatsNew: m.whatsNew };
    const ex = locs.data.find((l) => l.attributes.locale === locale);
    if (ex) {
      const fill = ex.attributes.supportUrl ? {} : { supportUrl };
      await asc('PATCH', `/v1/appStoreVersionLocalizations/${ex.id}`, { data: { type: 'appStoreVersionLocalizations', id: ex.id, attributes: { ...attrs, ...fill } } });
      out[locale] = ex.id;
    } else {
      const r = await asc('POST', '/v1/appStoreVersionLocalizations', {
        data: {
          type: 'appStoreVersionLocalizations',
          attributes: { locale, ...attrs, supportUrl, marketingUrl: base.marketingUrl ?? 'https://calmexam.com' },
          relationships: { appStoreVersion: { data: { type: 'appStoreVersions', id: versionId } } },
        },
      });
      out[locale] = r.data.id;
    }
    console.log(`${locale}: description, keywords, promotional text and what's new set`);
  }
  return out;
}

async function uploadShot(setId, file) {
  const buf = await readFile(file);
  const name = file.split(/[\\/]/).pop();
  const r = await asc('POST', '/v1/appScreenshots', {
    data: { type: 'appScreenshots', attributes: { fileName: name, fileSize: buf.length }, relationships: { appScreenshotSet: { data: { type: 'appScreenshotSets', id: setId } } } },
  });
  for (const op of r.data.attributes.uploadOperations) {
    const headers = Object.fromEntries((op.requestHeaders ?? []).map((h) => [h.name, h.value]));
    const res = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) });
    if (!res.ok) throw new Error(`upload ${name} part failed: ${res.status}`);
  }
  await asc('PATCH', `/v1/appScreenshots/${r.data.id}`, {
    data: { type: 'appScreenshots', id: r.data.id, attributes: { uploaded: true, sourceFileChecksum: createHash('md5').update(buf).digest('hex') } },
  });
  return r.data.id;
}

async function screenshots(locIds) {
  for (const [locale, locId] of Object.entries(locIds)) {
    const dir = join(SHOTS, locale);
    try {
      await stat(dir);
    } catch {
      continue;
    }
    const files = (await readdir(dir)).filter((f) => f.endsWith('.png')).sort().map((f) => join(dir, f));
    const sets = await asc('GET', `/v1/appStoreVersionLocalizations/${locId}/appScreenshotSets`);
    for (const other of sets.data.filter((x) => x.attributes.screenshotDisplayType !== DISPLAY)) {
      const shots = await asc('GET', `/v1/appScreenshotSets/${other.id}/appScreenshots?limit=50`);
      if (shots.data.some((x) => x.attributes.assetDeliveryState?.state === 'FAILED')) {
        await asc('DELETE', `/v1/appScreenshotSets/${other.id}`);
        console.log(`${locale}: removed ${other.attributes.screenshotDisplayType} set with failed screenshots`);
      }
    }
    let set = sets.data.find((s) => s.attributes.screenshotDisplayType === DISPLAY);
    if (!set) {
      set = (await asc('POST', '/v1/appScreenshotSets', {
        data: { type: 'appScreenshotSets', attributes: { screenshotDisplayType: DISPLAY }, relationships: { appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: locId } } } },
      })).data;
    }
    const old = await asc('GET', `/v1/appScreenshotSets/${set.id}/appScreenshots?limit=50`);
    for (const s of old.data) await asc('DELETE', `/v1/appScreenshots/${s.id}`);
    const ids = [];
    for (const f of files) ids.push(await uploadShot(set.id, f));
    for (let i = 0; i < 60; i++) {
      const cur = await asc('GET', `/v1/appScreenshotSets/${set.id}/appScreenshots?limit=50`);
      const states = cur.data.map((s) => s.attributes.assetDeliveryState?.state);
      if (states.some((s) => s === 'FAILED')) throw new Error(`${locale}: screenshot processing failed ${JSON.stringify(cur.data.map((s) => s.attributes.assetDeliveryState))}`);
      if (states.length === ids.length && states.every((s) => s === 'COMPLETE')) break;
      await sleep(5000);
    }
    await asc('PATCH', `/v1/appScreenshotSets/${set.id}/relationships/appScreenshots`, { data: ids.map((id) => ({ type: 'appScreenshots', id })) });
    console.log(`${locale}: ${ids.length} screenshots uploaded to ${DISPLAY}`);
  }
}

async function attachBuild(appId, versionId) {
  for (let i = 0; i < 90; i++) {
    const r = await asc('GET', `/v1/builds?filter[app]=${appId}&filter[preReleaseVersion.version]=${VERSION}&sort=-uploadedDate&limit=5`);
    const b = r.data.find((x) => x.attributes.processingState === 'VALID' && !x.attributes.expired);
    if (b) {
      await asc('PATCH', `/v1/appStoreVersions/${versionId}/relationships/build`, { data: { type: 'builds', id: b.id } });
      console.log(`attached build ${b.attributes.version} (${VERSION})`);
      return b;
    }
    console.log(`waiting for a processed ${VERSION} build (${r.data.map((x) => `${x.attributes.version}:${x.attributes.processingState}`).join(', ') || 'none yet'})`);
    await sleep(60000);
  }
  throw new Error(`no processed build for ${VERSION}`);
}

async function submit(appId, versionId) {
  const open = await asc('GET', `/v1/reviewSubmissions?filter[app]=${appId}&filter[platform]=IOS&filter[state]=READY_FOR_REVIEW,UNRESOLVED_ISSUES`);
  const sub = open.data[0] ?? (await asc('POST', '/v1/reviewSubmissions', {
    data: { type: 'reviewSubmissions', attributes: { platform: 'IOS' }, relationships: { app: { data: { type: 'apps', id: appId } } } },
  })).data;
  const items = await asc('GET', `/v1/reviewSubmissions/${sub.id}/items`);
  if (!items.data.length) {
    await asc('POST', '/v1/reviewSubmissionItems', {
      data: { type: 'reviewSubmissionItems', relationships: { reviewSubmission: { data: { type: 'reviewSubmissions', id: sub.id } }, appStoreVersion: { data: { type: 'appStoreVersions', id: versionId } } } },
    });
  }
  await asc('PATCH', `/v1/reviewSubmissions/${sub.id}`, { data: { type: 'reviewSubmissions', id: sub.id, attributes: { submitted: true } } });
  console.log(`submitted ${VERSION} for App Review (submission ${sub.id})`);
}

const apps = await asc('GET', `/v1/apps?filter[bundleId]=${BUNDLE_ID}`);
const appId = apps.data[0]?.id;
if (!appId) throw new Error(`no app for ${BUNDLE_ID}`);
const version = await editableVersion(appId);
console.log(`version ${VERSION}: ${version.id} (${version.attributes.appStoreState})`);
await appInfoText(appId);
const locIds = await versionText(version.id);
await screenshots(locIds);
await attachBuild(appId, version.id);
if (SUBMIT) await submit(appId, version.id);
else console.log('SUBMIT is not true: version prepared, not submitted');
