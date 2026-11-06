# CureWay — Showcase Mode Plan

**Status:** awaiting approval — no code written
**Branch:** `feat/showcase-mode` (already created from `chore/custom-subdomain` at `ced1a81`)
**Goal:** run the frontend fully standalone as a view-only portfolio showcase, with no backend at all.

---

## Part A — custom subdomain (complete)

`origin/chore/custom-subdomain` is at `ced1a81`; `git push` reports `Everything up-to-date`. GitHub access
works now, so the earlier 403 is resolved. No redo was needed.

Branch `feat/showcase-mode` exists locally at `ced1a81`, correctly branched off `chore/custom-subdomain`,
not yet pushed.

---

## 0. The headline finding

**The app is already 100% unusable, and it fails silently.** Six routes probed in a real browser:

| Route | Lands on | Network | Console |
| --- | --- | --- | --- |
| `/`, `/medicines`, `/pharmacy/home`, `/admin/dashboard`, `/notifications`, `/auth/sign-in` | **all → `/auth/sign-in`** | none | none |

Zero backend calls happen because `AuthProvider` → `authApi.refresh()` → `getRefreshToken()` returns `null`
and **throws before issuing a request**. So a visitor sees only the login form. Submitting it does hit the
dead host:

```
POST https://gsg-project-group-1-production.up.railway.app/auth/login
→ CORS error + net::ERR_FAILED, UI shows "Network Error"
```

Good news: nothing hangs (fails in <1s, not the 10s timeout). The practical consequence is that **the demo
session must be reachable without a backend round-trip**, and today's single visible surface is the sign-in
page — which is where showcase mode has to begin.

---

## 1. Backend dependency map

**12 modules reach the network; 15 files import the HTTP client.** All traffic funnels through one axios
instance: `src/lib/api/http.ts:66` (`baseURL`, Bearer interceptor, 401→refresh→retry queue).

### Shared / auth

| File | Endpoints |
| --- | --- |
| `src/features/auth/auth.api.ts` | `POST /auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/register/patient`, `/auth/register/pharmacy`, `/auth/register/driver` |
| `src/features/auth/AuthProvider.tsx` | calls `refresh()` on mount + after login + safety-net retry |
| `src/lib/api/http.ts:139` | bypass-interceptor `POST /auth/refresh` inside the 401 handler |

### Patient

| File | Endpoints |
| --- | --- |
| `src/services/profile.service.ts` | `GET /user/me`, `PATCH /user/me` |
| `src/services/medicineService.ts` | `GET /medicines`, `/medicines/{id}`, `/medicines/{id}/pharmacies`, `/medicines?categoryId=` |
| `src/services/categoriesService.ts` | `GET /categories?page&limit` |
| `src/components/features/category/services.ts` | `GET /categories/featured`, `/categories/all`, `/categories/{name}`, `/products/most-sales`, `/products/recommended` |
| `src/services/api.service.ts` | `POST /file/upload`; addresses `GET/POST /addresses`, `GET/PATCH/DELETE /addresses/{id}`, `PATCH /addresses/{id}/default`; prescriptions `POST /prescriptions`, `GET /prescriptions/my/{id}`, `PATCH /prescriptions/my/{id}/reupload`; orders `POST /orders`, `GET /orders`, `GET /orders/{id}`, `PATCH /orders/{id}/cancel` |
| `src/services/orders.service.ts` | `GET /cities` + delegates to the above |
| `src/store/order.store.ts` | all order reads/writes via `ordersService` |
| `src/hooks/useProfile.ts`, `hooks/categories/*`, `hooks/medicine/*` | consumers |

### Pharmacy

| File | Endpoints |
| --- | --- |
| `src/repositories/PharmacyProfile.ts` | `GET /pharmacies/me` |
| `src/repositories/inventory.repository.ts` | `GET /inventory`, `GET/DELETE /inventory/{id}`, `POST`, `PATCH` |
| `src/repositories/pharmacyOrders.repository.ts` | `GET /pharmacy-orders` |
| `src/services/api.service.ts` (pharmacy block) | `GET /pharmacy-order/my`, `/pharmacy-order/my/{id}`, `PATCH /pharmacy-order/{id}/decision`, `PATCH /pharmacy-order/{id}/status` |
| `src/hooks/pharmacy/*` (13 hooks) | consumers; `usePharmacyReport` derives charts from `getOrders` |

### Admin

`src/services/admin.service.ts` — **~30 endpoints**: `/users/admin`, `/pharmacies/admin`, `/drivers/admin`,
`/orders/admin`, `/inventory/admin`, `/medicines/admin`, `/categories/admin`, `/cities/admin`,
`/deliveries/admin`, plus `PATCH .../verification`, `.../activation`, `.../review`, `PUT .../delivery-fee`.
Consumed by `src/hooks/admin.hooks.ts` → the five `page.client.tsx` files. Dashboard charts
(`RevenueChart`, `TopCategories`, `SystemExperienceOverview`) already read `src/lib/mock/admin` — no backend.

### Auth storage and session

- Tokens: in-memory + `localStorage` keys `cureway_at` / `cureway_rt` (`http.ts:30-57`)
- **No middleware exists** (`middleware.ts` absent). All gating is client-side `AuthGuard`.
- `src/lib/auth/get-session.ts` reads cookie `session-token` — **a stub that always returns `null`**
  (`return null` inside the `try`). Sets no cookie anywhere.

### Image hosts

`next.config.ts:6-9` allows `**.railway.app`, `api.cureway.com`, `cdn.cureway.com`, `cdn.example.com`.
**No `src/` code produces URLs on any of them** — every image path found is local (`/patient/*`, `/icons/*`,
`/auth/*`). So the remote patterns are dead config, not a live dependency.

### Non-backend external call (easy to miss)

`src/components/patient/checkout/DeliveryAddressForm.tsx:36` — live `fetch` to
`https://nominatim.openstreetmap.org/reverse`. Not the backend, but it *is* a real network call and would
violate "zero network calls". Google Fonts are build-time self-hosted, so they are fine.

---

## 2. Sample data layer design

### Where the swap happens — one switch, at the transport

Put the switch in **`src/lib/api/http.ts` by replacing `http.defaults.adapter`** with a fixture adapter when
showcase mode is on.

```
http.defaults.adapter = showcase ? fixtureAdapter : undefined
```

Why this and not per-service flags:

- **One edit covers all ~60 endpoints.** Zero `if` statements in any service, hook, store or component.
- Everything above the transport keeps working untouched: react-query, `normalizeError`, the
  adapters/mappers (`InventoryMappers`, `pharmacyProfile`, `pharmacyOrders`), loading/error states,
  pagination meta.
- **Guarantees zero network** — axios physically cannot emit a request without an adapter. Provable, not audited.
- Response envelopes (`{success, data, meta}`) get enforced in one router instead of 12 services.

New files (~8):

```
src/lib/showcase/config.ts        # SHOWCASE_MODE flag, demo role storage key
src/lib/showcase/adapter.ts       # axios adapter: method+path → fixture
src/lib/showcase/router.ts        # route table, pagination/search/sort helpers
src/lib/showcase/db.ts            # in-memory mutable store, seeded from fixtures
src/lib/showcase/fixtures/{auth,medicines,categories,pharmacies,orders,
                            prescriptions,inventory,admin,notifications}.ts
```

The flag: `NEXT_PUBLIC_SHOWCASE_MODE`, defaulting to **on** when `NEXT_PUBLIC_API_BASE_URL` is unset — so the
portfolio deploy needs no extra config, and anyone pointing it at a real API gets normal behaviour back.

### Fixtures needed, and shape matching

Shapes are already fully typed, so fixtures will be derived from the existing DTOs and cannot drift:

| Fixture | Shape source | Reuse available |
| --- | --- | --- |
| Users/profiles (3 roles) | `src/features/auth/auth.types.ts`, `types/auth.ts` | new |
| Medicines | `types/medicine.types.ts`, `MedicineDTO` | partly `searchDemoData.ts` (539 lines) |
| Categories | `types/categories.types.ts` | `lib/mock/home` |
| Pharmacies | `types/PharmacyProfile.ts` | `services/nearbypharmacies.data.ts` (69 lines) |
| Patient orders | `types/api.types.ts` `PatientOrder*Dto` | `services/orders.mock.ts` (40 lines) |
| Pharmacy orders | `types/pharmacyOrders.ts` | new |
| Inventory | `types/pharmacyTypes.ts` | new |
| Prescriptions | `types/api.types.ts` `PrescriptionResponseDto` | new |
| Addresses / cities | `PatientAddressResponse`, `CityDto` | new |
| Admin lists | `services/admin.service.ts` exported types | `lib/mock/admin/*` (1,377 lines) |
| Notifications | existing page components | new |

**~2,600 lines of existing mock data are reusable** (`src/lib/mock/**`, `src/data/mockData.ts`,
`services/searchDemoData.ts`, `nearbypharmacies.data.ts`, `orders.mock.ts`). Consolidate rather than duplicate.

> **Constraint found:** `src/services/orders.service.ts:182` has a mock-data guard that **throws when
> `pharmacyId < 10` or `inventoryId < 10`** ("Real IDs from this backend are ≥ 10"). All fixture IDs must
> start at 10+, or checkout will reject its own sample data.

### Images

Everything local in `public/` — already true today. Plan: **delete all four `remotePatterns`** from
`next.config.ts` so no remote host can ever load. Where a fixture needs a photo, reuse existing assets
(`/patient/*.png`, `/icons/medicine/*`, `/placeholder-medicine.png`). `src/public/` (3 svgs) is a dead
directory — Next only serves root `public/`; delete it.

### The dead Railway fallback

Remove the hardcoded URL from `http.ts:69`. Replacement behaviour:

- showcase on → `baseURL` set to an inert sentinel (never used; the adapter short-circuits first)
- showcase off + env var set → use it
- showcase off + env var missing → **throw at startup with a clear message** instead of silently retrying a
  dead host

---

## 3. Demo auth and role switcher

Keep `AuthProvider`, `AuthGuard`, `useAuth`, `getRoleHome` and every `AuthGuard` call site **completely
unchanged** — the adapter serves `/auth/*` so the existing flow just succeeds.

**Flow:**

1. Visitor hits `/` → `AuthProvider` calls `refresh()` → `getRefreshToken()` must return something. One small
   change needed in showcase mode: seed a demo refresh token on first load (`showcase/config.ts` writes
   `cureway_rt = "showcase"` if absent) so `refresh()` reaches the adapter instead of throwing.
2. Adapter answers `POST /auth/refresh` with the user+profile for the **currently selected demo role** (read
   from `localStorage.cureway_demo_role`, default `PATIENT`).
3. `AuthGuard` sees a valid role and renders. No redirect-to-sign-in dead end.
4. **Sign-in page**: any credentials succeed and enter the demo session; add a visible
   "Explore as Patient / Pharmacy / Admin" choice plus prefilled demo credentials, so it reads as intentional
   rather than as a bypass. `POST /auth/login` is served by the adapter.
5. **Sign-up**: validation runs as today; on submit the adapter returns a session for the requested role and
   routes to the existing `registration-submitted` page. No persistence.
6. **Role switch**: set `cureway_demo_role` → `queryClient.clear()` → `refreshIfNeeded()` →
   `router.replace(getRoleHome(role))`. Protected routes then work exactly as designed.

One wrinkle: `AuthGuard` sends a `VERIFIED` pharmacy that lands outside `/pharmacy` back to `/pharmacy/home`,
and shows `AccountUnderReview` for `UNDER_REVIEW`. The pharmacy fixture should be `VERIFIED` so the portal is
explorable — add a second pharmacy fixture flagged `UNDER_REVIEW` only if that screen should be demoable.

**Switcher placement.** The three portals have separate chrome (`HomeHeader` for patient, `Topbar`/`Sidebar`
for pharmacy, `AdminHeader` for admin), so there is no shared header to hook. Recommendation: **one component
mounted in `src/app/layout.tsx`** (inside `AuthProvider`/`QueryProvider`), carrying both the notice and the
switcher. See §5 for the layout trade-off.

---

## 4. Action matrix

Rule: **local-only** = mutates the in-memory `db.ts` + react-query cache, survives navigation, resets on
reload. **Disabled** = control is `disabled` with the showcase message via the existing
`ToastProvider`/`sonner`. Nothing spins forever: the adapter always resolves, with a 150–400ms simulated
latency so skeletons still read naturally.

### Patient

| Action | Behaviour | Note |
| --- | --- | --- |
| Search + filters | **works** | already local (`searchDummy`) |
| Browse medicines / categories / pharmacies | **works** | fixtures |
| Medicine detail, similar, pharmacies-by-medicine | **works** | fixtures |
| Cart add / remove / qty / save-for-later | **works** | already localStorage |
| Apply / remove coupon | **works** | `MOCK_COUPONS` exists |
| Address add / edit / delete / set default | **local only** | `STORAGE_KEYS.DELIVERY_ADDRESSES` exists |
| Reverse-geocode "use my location" | **local only** | **stub the OSM fetch** — required for zero-network |
| Checkout → place order | **local only** | order appears in `/orders`; fixture IDs ≥ 10 |
| Order detail / cancel | **local only** | |
| Upload prescription | **local only, not persisted** | file previewed from an object URL; label "not stored in showcase mode" |
| Profile view | **works** | fixture |
| Profile update | **local only** | toast: not saved |
| Notifications | **works** after fixing the `requirePatient` stub (§6) | |
| Forgot password / verify OTP / verify phone | **works as-is** | already fake `setTimeout`, no API |
| Continue with Google / Facebook / Apple | **disabled** | currently dead buttons — see §6 |

### Pharmacy

| Action | Behaviour |
| --- | --- |
| Home snapshot, today's summary, critical stock | **works** (fixtures) |
| Orders list / search / detail | **works** |
| Accept / reject order | **local only** (status flips, list re-renders) |
| Set PREPARING / READY_FOR_PICKUP | **local only** |
| Inventory list / detail / search | **works** |
| Add / edit / delete inventory item | **local only** |
| Report charts | **works** — `getPharmacyReport` derives from the order fixtures automatically |
| Profile view | **works** |
| Profile edit / avatar / delete account | **disabled** |

### Admin

| Action | Behaviour |
| --- | --- |
| Dashboard charts | **works** (already `lib/mock/admin`) |
| Patients / pharmacies / orders / products / deliveries / inventory / medicines / drivers lists | **works** — pagination, search, sort handled in the fixture router |
| Detail drawers | **works** |
| Pharmacy / driver verification approve-reject | **local only** (high demo value) |
| Medicine activation / review | **local only** |
| Medicine create / update | **disabled** |
| Category create / update | **disabled** |
| City create / update / delete / delivery-fee | **disabled** |
| Notifications + settings | **works** / **disabled** for writes |

---

## 5. Showcase notice

Reuse `AnnouncementsBar`'s visual language — `bg-primary`, `text-primary-light`, `text-t-14 font-semibold`,
`AnimatePresence` with `useReducedMotion` — so it reads as part of the system. Dismissal persists in
`localStorage` wrapped in `try/catch` (private-window safe).

Copy, as specified:

> **Showcase version.** CureWay was built as a production project for Code2Career at Gaza Sky Geeks. The live
> backend has been retired, so this version runs on sample data.

**Placement — decision needed.** Two options:

- **(A) Slim sticky top strip** in `src/app/layout.tsx`, above all three portals, with the role switcher
  inside it. Most legible, matches "slim dismissible notice".
  **Cost: shifts every page down ~36–40px**, which technically touches layout in all three portals.
- **(B) Floating pill, bottom-right**, expanding on click. **Zero layout shift**, fully respects
  "don't change the UI", but less prominent for a portfolio visitor.

Recommendation: **(A)** — a portfolio viewer should understand within a second why data looks synthetic, and
the shift is uniform and intentional rather than a regression. (B) is available if the no-layout-change rule
is strict.

---

## 6. Known gaps found

| # | Gap | Severity |
| --- | --- | --- |
| 1 | **`/auth/pharmacy/sign-in` has no `page.tsx`** — route 404s, and `PharmacySignInForm.tsx` (7.3 KB) is imported by **nothing**. Dead code, and pharmacies have no dedicated sign-in. | high |
| 2 | **`get-session.ts` always returns `null`** — a `return null` sits inside the `try`. So `requirePatient()` always redirects, making **`/notifications` permanently unreachable**. Only call site: `src/app/(patient)/notifications/page.tsx:9`. | high |
| 3 | **Endpoint inconsistency**: `pharmacyOrders.repository.ts` calls `/pharmacy-orders`, but `API_ENDPOINTS.PHARMACY_ORDERS.LIST` is `/pharmacy-order/my`. Two conventions for one resource — the fixture router must serve both. | medium |
| 4 | Dead Railway URL hardcoded at `http.ts:69` masks a missing env var as confusing network errors. | medium |
| 5 | Four dead image `remotePatterns` in `next.config.ts`. | low |
| 6 | Social sign-in buttons are pure decoration — no handler at all. | low |
| 7 | `src/public/` (3 svgs) is dead; Next serves only root `public/`. | low |
| 8 | `AnnouncementsBar` centre text is the literal placeholder `"Announcements Bar"`. | low |
| 9 | 16 pre-existing lint warnings (unused vars; one `react-hooks/exhaustive-deps` in `DeleteProfile.tsx`). | low |

Proposal: fix **1–5** as part of this work (they block or confuse showcase mode) and leave 6–9 unless
requested. **#8 is the one place where fixing a gap means changing copy** — flagged rather than assumed.

---

## 7. Verification plan

Scripted with the pre-installed Playwright/Chromium, run against `pnpm build && pnpm start`.

**Proving zero backend calls (the strong version):**

1. **Block everything at the browser**: `page.route('**/*', ...)` that `abort()`s any request whose URL is not
   `http://127.0.0.1:<port>`, and records it. A clean run means the app never even *attempted* an external
   call — stronger than observing that none appeared.
2. Walk **every route** (52 from the build manifest) in **all three roles**, asserting the aborted list is empty.
3. Exercise each **local-only** action from §4 and assert still empty — mutations are where a stray call would hide.
4. **Belt and braces at the source**: assert `http.defaults.adapter` is the fixture adapter, and grep the built
   client bundles in `.next/static` for `railway.app`, `nominatim`, `http://localhost:3001` → must be zero hits.

**Zero console errors:** collect `console` (type `error`/`warning`), `pageerror` and `requestfailed` per
route; fail the run on any entry. Baseline is already clean, so any new entry is newly introduced.

**Per-role, no-hang coverage:** for each role, assert every page reaches a terminal state — real content or an
intentional empty/disabled state — with **no skeleton or spinner still mounted after 5s**. This is the
specific guard against "spins forever".

**Also:** `pnpm lint` (expect 0 errors, still 16 warnings), `pnpm typecheck`, `pnpm build`, plus re-confirming
the Part A SEO assertions still hold (canonical/OG/sitemap on the new domain).

Script output will be reported verbatim, not summarised.

---

## 8. Branch, size, risks, decisions

**Branch:** `feat/showcase-mode`, already created from `chore/custom-subdomain` at `ced1a81`. Not merging to main.

**Size** (454 `.ts/.tsx` files in `src/` today):

| | Count | What |
| --- | --- | --- |
| New files | **~12** | showcase config/adapter/router/db + 9 fixture modules + notice/switcher components |
| Modified | **~8** | `http.ts`, `app/layout.tsx`, `next.config.ts`, sign-in/sign-up pages, `get-session.ts`, `DeliveryAddressForm.tsx` (geocode stub), `.env.local.example` + README |
| New files for gaps | **~1** | `auth/pharmacy/sign-in/page.tsx` |
| Deleted | **~4** | `src/public/` leftovers |
| Net LOC | **~2,000–2,800 added**, mostly fixtures | |

Services, hooks, stores, adapters and all 67 `<Image>` components stay **untouched** — that is the point of
switching at the transport.

### Risks

1. **Fixture-shape drift** — a wrong envelope surfaces as a blank list, not an error. Mitigation: type every
   fixture against the existing DTOs so `tsc` catches mismatches, plus the per-route content assertions in §7.
2. **The `< 10` ID guard** (`orders.service.ts:182`) silently breaks checkout if a fixture uses a low ID.
   Mitigation: all IDs ≥ 10, with a test that places an order end-to-end.
3. **Dual pharmacy-order endpoints** (gap #3) — easy to serve one and miss the other, leaving half the
   pharmacy portal empty. Mitigation: router covers both; coverage assertion that every endpoint in the §1
   map is hit at least once across the walk.
4. **`AuthGuard` redirect loops** if a fixture profile has an unexpected `verificationStatus` or role casing
   (`"PATIENT"` uppercase is required by `isAppRole`). Mitigation: explicit per-role route walk.
5. **Seeding a fake refresh token** is the one place real auth plumbing is touched. It is gated behind the
   showcase flag, but worth awareness.
6. **Layout shift** from the top strip (§5), if option A is chosen.

### Decisions needed before starting

1. **Notice placement** — top strip (A, recommended, ~36px shift) or floating pill (B, no shift)?
2. **Prescription upload** — local-only preview labelled "not stored" (recommended), or fully disabled?
3. **Admin write actions** — proposed split is verification/activation/review = local-only,
   create/update/delete = disabled. Everything local-only instead (more impressive, more fixture surface), or
   everything disabled (safest)?
4. **OSM reverse-geocode** — stub it (required for a literal "zero network calls" claim, recommended) or keep
   the live call and scope the claim to "zero backend calls"?
5. **Gap #8** — may the placeholder `"Announcements Bar"` text be replaced? It is the only copy change
   proposed, and it currently looks unfinished.
6. **Known gaps 6–9** (dead social buttons, `src/public/`, lint warnings) — fix in this branch or leave alone?
