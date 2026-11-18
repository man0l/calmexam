// Creates (or reuses) the CalmExam RevenueCat catalog through the REST API v2:
// App Store, Play Store and Test Store apps, annual + monthly products, the
// "pro" entitlement, and the current "default" offering with $rc_annual and
// $rc_monthly packages. Safe to re-run: existing objects are matched and kept.
//
// Env: REVENUECAT_SECRET_KEY (v2 secret key with project configuration
// read/write), optional REVENUECAT_PROJECT_ID, optional PUSH_TO_STORES=1 to ask
// RevenueCat to create the App Store / Play products (needs store credentials
// connected in RevenueCat).

const API = 'https://api.revenuecat.com/v2';
const KEY = process.env.REVENUECAT_SECRET_KEY;
const BUNDLE_ID = 'com.balkanbit.calmexam';
const ENTITLEMENT = { lookup_key: 'pro', display_name: 'CalmExam Pro' };
const OFFERING = { lookup_key: 'default', display_name: 'Default' };
const PLANS = [
  { id: 'annual', title: 'CalmExam Pro Yearly', duration: 'P1Y', apple: 'calmexam_pro_annual', play: 'calmexam_pro:annual', pkg: '$rc_annual', position: 1 },
  { id: 'monthly', title: 'CalmExam Pro Monthly', duration: 'P1M', apple: 'calmexam_pro_monthly', play: 'calmexam_pro:monthly', pkg: '$rc_monthly', position: 2 },
];

if (!KEY) {
  console.error('REVENUECAT_SECRET_KEY is not set');
  process.exit(1);
}

async function rc(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text}`);
  return json;
}

async function list(path) {
  const items = [];
  let next = `${path}${path.includes('?') ? '&' : '?'}limit=100`;
  while (next) {
    const page = await rc('GET', next.replace(/^\/v2/, ''));
    items.push(...(page.items ?? []));
    next = page.next_page ?? null;
  }
  return items;
}

async function projectId() {
  if (process.env.REVENUECAT_PROJECT_ID) return process.env.REVENUECAT_PROJECT_ID;
  const projects = await list('/projects');
  const match = projects.find((p) => /calmexam/i.test(p.name)) ?? (projects.length === 1 ? projects[0] : null);
  if (!match) throw new Error(`Set REVENUECAT_PROJECT_ID. Projects: ${projects.map((p) => `${p.id} ${p.name}`).join(', ')}`);
  return match.id;
}

async function ensureApp(pid, apps, type, body) {
  const found = apps.find((a) => a.type === type);
  if (found) return found;
  if (!body) throw new Error(`No ${type} app in the project. Create it in the RevenueCat dashboard and re-run.`);
  console.log(`creating ${type} app`);
  return rc('POST', `/projects/${pid}/apps`, { name: 'CalmExam', type, ...body });
}

async function ensureProduct(pid, products, app, plan) {
  const storeId = app.type === 'play_store' ? plan.play : plan.apple;
  const found = products.find((p) => p.app_id === app.id && p.store_identifier === storeId);
  if (found) return found;
  console.log(`creating product ${storeId} on ${app.type}`);
  const body = { store_identifier: storeId, app_id: app.id, type: 'subscription', display_name: plan.title };
  if (app.type === 'test_store') Object.assign(body, { title: plan.title, subscription: { duration: plan.duration } });
  const created = await rc('POST', `/projects/${pid}/products`, body);
  if (process.env.PUSH_TO_STORES === '1' && app.type !== 'test_store') {
    try {
      await rc('POST', `/projects/${pid}/products/${created.id}/create_in_store`, {});
      console.log(`  pushed ${storeId} to ${app.type}`);
    } catch (e) {
      console.warn(`  could not push ${storeId} to ${app.type}: ${e.message}`);
    }
  }
  return created;
}

const pid = await projectId();
console.log(`project ${pid}`);

const apps = await list(`/projects/${pid}/apps`);
const targets = [
  await ensureApp(pid, apps, 'app_store', { app_store: { bundle_id: BUNDLE_ID } }),
  await ensureApp(pid, apps, 'play_store', { play_store: { package_name: BUNDLE_ID } }),
  await ensureApp(pid, apps, 'test_store', null),
];

const products = await list(`/projects/${pid}/products`);
const byPlan = Object.fromEntries(PLANS.map((p) => [p.id, []]));
for (const app of targets) {
  for (const plan of PLANS) byPlan[plan.id].push(await ensureProduct(pid, products, app, plan));
}
const allIds = Object.values(byPlan).flat().map((p) => p.id);

const entitlements = await list(`/projects/${pid}/entitlements`);
const entitlement =
  entitlements.find((e) => e.lookup_key === ENTITLEMENT.lookup_key) ?? (await rc('POST', `/projects/${pid}/entitlements`, ENTITLEMENT));
const attached = new Set((await list(`/projects/${pid}/entitlements/${entitlement.id}/products`)).map((p) => p.id));
const toAttach = allIds.filter((id) => !attached.has(id));
if (toAttach.length) await rc('POST', `/projects/${pid}/entitlements/${entitlement.id}/actions/attach_products`, { product_ids: toAttach });
console.log(`entitlement ${entitlement.lookup_key}: ${allIds.length} products`);

const offerings = await list(`/projects/${pid}/offerings`);
let offering = offerings.find((o) => o.lookup_key === OFFERING.lookup_key) ?? (await rc('POST', `/projects/${pid}/offerings`, OFFERING));
if (!offering.is_current) offering = await rc('POST', `/projects/${pid}/offerings/${offering.id}`, { is_current: true });
const packages = await list(`/projects/${pid}/offerings/${offering.id}/packages`);
for (const plan of PLANS) {
  const pkg =
    packages.find((p) => p.lookup_key === plan.pkg) ??
    (await rc('POST', `/projects/${pid}/offerings/${offering.id}/packages`, { lookup_key: plan.pkg, display_name: plan.title, position: plan.position }));
  const have = new Set((await list(`/projects/${pid}/packages/${pkg.id}/products`)).map((p) => p.product?.id ?? p.id));
  const add = byPlan[plan.id].filter((p) => !have.has(p.id)).map((p) => ({ product_id: p.id, eligibility_criteria: 'all' }));
  if (add.length) await rc('POST', `/projects/${pid}/packages/${pkg.id}/actions/attach_products`, { products: add });
  console.log(`package ${plan.pkg}: ${byPlan[plan.id].length} products`);
}
console.log(`offering ${offering.lookup_key} is current`);

const SECRET_NAME = { app_store: 'EXPO_PUBLIC_REVENUECAT_IOS_KEY', play_store: 'EXPO_PUBLIC_REVENUECAT_KEY', test_store: 'EXPO_PUBLIC_REVENUECAT_TEST_STORE_KEY' };
console.log('\nPublic SDK keys (safe to ship in the app). Add them as GitHub Actions secrets:');
for (const app of targets) {
  const keys = await list(`/projects/${pid}/apps/${app.id}/public_api_keys`);
  console.log(`  ${SECRET_NAME[app.type]} = ${keys[0]?.key ?? '(none)'}`);
}
console.log('\nStill manual: set the 7-day free trial and prices on each product (App Store Connect intro offer, Play base plan offer, Test Store price in the RevenueCat dashboard).');
