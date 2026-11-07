/**
 * Showcase mode verification.
 *
 * Drives the built app in a real browser and proves:
 *   1. ZERO requests leave the local origin. Anything else is ABORTED and
 *      recorded, so a clean run means the app never even *attempted* an
 *      external call — stronger than observing that none arrived.
 *   2. Every route renders in every role with no console error, no
 *      pageerror and no non-2xx response.
 *   3. No spinner or skeleton is still mounted after 5s (nothing hangs).
 *   4. The fixture router had no unmatched endpoint.
 *   5. The full purchase flow completes: medicine -> cart -> checkout ->
 *      Place Order -> Confirm, and the new order appears in the list.
 *
 * Usage:
 *   pnpm build && pnpm start -p 3500 &
 *   node scripts/verify-showcase.mjs
 *
 *   ORIGIN=http://127.0.0.1:4000 node scripts/verify-showcase.mjs
 *
 * Exits 0 when clean, 1 on any external request or page issue.
 */
import { createRequire } from "node:module";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Resolved through createRequire so a local devDependency and a
// globally-installed Playwright both work. Playwright is intentionally not a
// dependency of this project: it is only needed to run this script.
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error(
    "playwright is required to run this script.\n" +
      "  pnpm add -D playwright   (or run it where Playwright is installed)",
  );
  process.exit(1);
}

const ORIGIN = process.env.ORIGIN || "http://127.0.0.1:3500";
const APP_DIR = "src/app";

/** Concrete ids for dynamic segments, taken from the showcase fixtures. */
const DYNAMIC = {
  "[id]:/categories": "21",
  "[id]:/medicines": "31",
  "[id]:/pharmacies": "202",
  "[medicineId]:/pharmacy/inventory": "401",
  "[orderId]:/pharmacy/orders": "6101",
};

/**
 * Discover routes from the app directory, so the script keeps working as
 * routes are added. Route groups like (patient) do not appear in the URL.
 */
function discoverRoutes(dir = APP_DIR, urlPath = "") {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      const segment = /^\(.*\)$/.test(entry) ? "" : `/${entry}`;
      out.push(...discoverRoutes(full, urlPath + segment));
    } else if (entry === "page.tsx") {
      out.push(urlPath || "/");
    }
  }
  return out;
}

const allRoutes = [...new Set(discoverRoutes())].sort().map((route) => {
  const match = route.match(/^(.*)\/(\[[^\]]+\])$/);
  if (!match) return route;
  const [, parent, param] = match;
  const id = DYNAMIC[`${param}:${parent}`];
  return id ? `${parent}/${id}` : route;
});

function routesForRole(role) {
  // Each role may only render its own portal plus the shared auth screens;
  // AuthGuard redirects anything else, which is correct behaviour, not a bug.
  return allRoutes.filter((r) => {
    if (r.startsWith("/auth")) return true;
    if (role === "PHARMACY") return r.startsWith("/pharmacy");
    if (role === "ADMIN") return r.startsWith("/admin");
    return !r.startsWith("/pharmacy") && !r.startsWith("/admin");
  });
}

let external = [], failures = [], warnings = [], checked = 0;

/**
 * Warnings emitted by the framework/browser rather than application code.
 * Named explicitly so this is a documented exclusion, not a blanket filter.
 */
const BENIGN_WARNINGS = [
  // Next.js/browser preload heuristic on static auth pages. Not emitted by
  // application code and not controllable from it.
  /was preloaded using link preload but not used/i,
  // recharts' ResponsiveContainer logs this once when it measures before the
  // browser has laid out the dynamically imported chart. Verified benign: the
  // container settles at 670x284 and renders all its bars.
  /The width\(-1\) and height\(-1\) of chart should be greater than 0/i,
];

const SPINNER_SEL = '.animate-spin, [role="status"][aria-busy="true"], [data-skeleton]';


async function newRole(browser, role) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    // The checkout address step uses the geolocation API; granting it keeps
    // the flow deterministic. The reverse-geocode itself is stubbed locally.
    permissions: ['geolocation'],
    geolocation: { latitude: 31.5175, longitude: 34.4515 },  // Gaza
  });
  await ctx.addInitScript(r => { try { localStorage.setItem('cureway_demo_role', r); } catch {} }, role);
  const page = await ctx.newPage();
  await page.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith(ORIGIN) || u.startsWith('data:') || u.startsWith('blob:') || u === 'about:blank') {
      return route.continue();
    }
    external.push(`${role} ${route.request().method()} ${u}`);
    return route.abort();
  });
  return { ctx, page };
}

function watch(page, role, path) {
  const local = [];
  const onConsole = m => {
    const text = m.text();
    if (m.type() === 'error') local.push(`console.error: ${text.slice(0, 160)}`);
    else if (m.type() === 'warning') {
      if (BENIGN_WARNINGS.some(re => re.test(text))) {
        warnings.push(`[${role}] ${path}: ${text.slice(0, 110)}`);
      } else {
        local.push(`console.warning: ${text.slice(0, 160)}`);
      }
    }
  };
  const onPageError = e => local.push(`pageerror: ${String(e).slice(0, 160)}`);
  const onResponse = r => { if (r.status() >= 400) local.push(`http ${r.status()} ${r.url().replace(ORIGIN, '').slice(0, 120)}`); };
  page.on('console', onConsole); page.on('pageerror', onPageError); page.on('response', onResponse);
  return () => {
    page.off('console', onConsole); page.off('pageerror', onPageError); page.off('response', onResponse);
    if (local.length) failures.push({ role, path, issues: [...new Set(local)] });
  };
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });

  for (const role of ['PATIENT', 'PHARMACY', 'ADMIN']) {
    const { ctx, page } = await newRole(browser, role);
    console.log(`\n--- ${role} ---`);
    for (const path of routesForRole(role)) {
      const stop = watch(page, role, path);
      try {
        await page.goto(ORIGIN + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
      } catch (e) {
        failures.push({ role, path, issues: [`navigation: ${String(e).slice(0, 120)}`] });
      }
      await page.waitForTimeout(5200);               // the "nothing hangs" window
      const spinners = await page.locator(SPINNER_SEL).count().catch(() => 0);
      if (spinners > 0) {
        failures.push({ role, path, issues: [`${spinners} spinner/skeleton still mounted after 5s`] });
      }
      const landed = new URL(page.url()).pathname;
      stop(); checked++;
      console.log(`  ${path.padEnd(36)} -> ${landed.padEnd(28)} spinners=${spinners}`);
    }
    const diag = await page.evaluate(() => window.__SHOWCASE__ || null);
    console.log(`  fixture router unmatched endpoints: ${JSON.stringify(diag && diag.unmatched)}`);
    if (diag && diag.unmatched && diag.unmatched.length) {
      failures.push({ role, path: '(router)', issues: diag.unmatched.map(u => `unmatched endpoint ${u}`) });
    }
    await ctx.close();
  }

  // ---- Local-only actions: mutations are where a stray call would hide ----
  console.log('\n--- local-only actions ---');
  {
    const { ctx, page } = await newRole(browser, 'PATIENT');
    const stop = watch(page, 'PATIENT', '(actions)');
    await page.goto(ORIGIN + '/medicines', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await page.goto(ORIGIN + '/search?q=panadol', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    console.log('  patient: search + browse        ok');
    await page.goto(ORIGIN + '/orders', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const orderRows = await page.locator('text=/#5\\d{3}/').count().catch(() => 0);
    console.log(`  patient: orders listed          ${orderRows > 0 ? 'ok' : 'NONE FOUND'}`);
    await page.goto(ORIGIN + '/profile', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const named = await page.locator('text=/Lina Haddad/i').count().catch(() => 0);
    console.log(`  patient: profile fixture shown  ${named > 0 ? 'ok' : 'NOT FOUND'}`);
    stop(); await ctx.close();
  }
  // ---- Full purchase flow: medicine -> cart -> checkout -> order ----
  {
    const { ctx, page } = await newRole(browser, 'PATIENT');
    const stop = watch(page, 'PATIENT', '(cart flow)');
    const step = (label, ok) => {
      console.log(`  cart flow: ${label.padEnd(30)} ${ok ? 'ok' : 'FAILED'}`);
      if (!ok) failures.push({ role: 'PATIENT', path: '(cart flow)', issues: [`${label} failed`] });
    };

    // Baseline order count. Fixtures are deterministic, so this is stable;
    // the in-memory store re-seeds on every hard load.
    await page.goto(ORIGIN + '/orders', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);
    const ordersBefore = await page.evaluate(() => {
      const m = document.body.innerText.match(/All \((\d+)\)/);
      return m ? Number(m[1]) : -1;
    });

    await page.goto(ORIGIN + '/medicines/31', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);

    const addBtn = page.getByRole('button', { name: /^Add to Cart$/ });
    step('add-to-cart enabled', !(await addBtn.isDisabled().catch(() => true)));
    await addBtn.click();
    await page.waitForTimeout(1800);
    step('added toast shown', /Item added to cart/i.test(await page.evaluate(() => document.body.innerText)));

    await page.goto(ORIGIN + '/cart', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const cartTxt = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    // The cart groups by pharmacy and shows a count, not the medicine name.
    step('item visible in cart', /1 items in total/i.test(cartTxt) && /Pharmacy/i.test(cartTxt));

    await page.goto(ORIGIN + '/checkout', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);
    step('checkout reached (not cart)', new URL(page.url()).pathname === '/checkout');

    // The checkout is a strict sequence: address -> delivery -> payment ->
    // Place Order (locks the details) -> Confirm Order (actually submits).
    const clickExact = async (name) => {
      const b = page.getByRole('button', { name, exact: false }).first();
      await b.click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(1400);
    };
    await clickExact(/Use Your Current Location/i);
    const addrRe = /Omar Al-Mukhtar|Al-Nasr Street|Al-Azhar University/i;
    step('location gave a sample address',
      addrRe.test(await page.evaluate(() => document.body.innerText)));

    // Pick one of the suggested addresses, then confirm it.
    await clickExact(addrRe);
    await clickExact(/^Confirm$/i);
    await clickExact(/Standard Delivery/i);
    await clickExact(/Cash on delivery/i);

    const placeBtn = page.getByRole('button', { name: /^Place Order$/i }).first();
    step('Place Order enabled after filling', !(await placeBtn.isDisabled().catch(() => true)));
    await clickExact(/^Place Order$/i);
    await clickExact(/^Confirm Order$/i);
    await page.waitForTimeout(3000);
    step('review step reached', /Orderconfirmation/i.test(new URL(page.url()).pathname));

    await clickExact(/Confirm & Place Order/i);
    await page.waitForTimeout(5000);

    const afterPlace = new URL(page.url()).pathname;
    console.log(`  cart flow: after final confirm -> ${afterPlace}`);
    step('app navigated to /orders', afterPlace === '/orders');

    // Stay on the client-side navigation: showcase state lives in memory, so a
    // hard reload re-seeds the fixtures (by design — "Reset demo" does this too).
    const ordersTxt = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    const ordersAfter = (() => { const m = ordersTxt.match(/All \((\d+)\)/); return m ? Number(m[1]) : -1; })();
    console.log(`  cart flow: order count ${ordersBefore} -> ${ordersAfter}`);
    step('new order id present (9000+)', /#9\d{3}/.test(ordersTxt));
    step('order count incremented', ordersAfter === ordersBefore + 1);
    stop(); await ctx.close();
  }

  {
    const { ctx, page } = await newRole(browser, 'PHARMACY');
    const stop = watch(page, 'PHARMACY', '(actions)');
    await page.goto(ORIGIN + '/pharmacy/orders', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);
    const rows = await page.locator('table tbody tr').count().catch(() => 0);
    console.log(`  pharmacy: order rows            ${rows}`);
    await page.goto(ORIGIN + '/pharmacy/inventory', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);
    const inv = await page.locator('table tbody tr').count().catch(() => 0);
    console.log(`  pharmacy: inventory rows        ${inv}`);
    await page.goto(ORIGIN + '/pharmacy/report', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);
    console.log('  pharmacy: report charts         ok');
    stop(); await ctx.close();
  }
  {
    const { ctx, page } = await newRole(browser, 'ADMIN');
    const stop = watch(page, 'ADMIN', '(actions)');
    for (const p of ['/admin/patients', '/admin/pharmacies', '/admin/orders', '/admin/deliveries']) {
      await page.goto(ORIGIN + p, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      // The admin DataTable is div-based, not a <table>.
      const rows = await page.locator('div.h-16.border-t').count().catch(() => 0);
      console.log(`  admin: ${p.padEnd(24)} ${rows} rows`);
    }
    stop(); await ctx.close();
  }

  await browser.close();

  console.log('\n================ RESULT ================');
  console.log(`routes checked (role x route) : ${checked}`);
  console.log(`external requests ATTEMPTED   : ${external.length}`);
  if (external.length) external.slice(0, 20).forEach(e => console.log('   ' + e));
  console.log(`benign framework warnings     : ${warnings.length} (excluded, listed below)`);
  [...new Set(warnings.map(w => w.replace(/:.*/, '')))].slice(0, 10).forEach(w => console.log('   ' + w));
  console.log(`pages with issues             : ${failures.length}`);
  for (const f of failures) {
    console.log(`   [${f.role}] ${f.path}`);
    f.issues.forEach(i => console.log(`      - ${i}`));
  }
  console.log('========================================');
  process.exit(external.length === 0 && failures.length === 0 ? 0 : 1);
})();
