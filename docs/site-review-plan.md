# CureWay — full site review

> **Status: fixed.** Everything below was found by the audit described under
> *Method*. The high-severity issues and the agreed medium ones have been
> fixed on `feat/showcase-polish`; see *Outcome* at the end for what was done,
> what was deliberately left, and two corrections to this document.

**Method.** Every route from the build manifest was crawled in a real browser as each of the
three roles, at **360, 390, 768, 1024, 1280 and 1440** px — 54 role-routes × 6 widths =
**324 page loads**, producing **462 raw findings**. Auth screens are audited once under the
patient role, since that is the only role that can reach them. Each page was measured for
horizontal overflow (and which elements cause it), touch-target size, text below 12px,
missing `alt`, heading order, currency and date formats, placeholder text, and console
output. Static analysis of the source supplements the crawl where a problem is better
counted than screenshotted.

Screenshots are in [`review-screenshots/`](review-screenshots/). `A*` files are evidence for
a specific finding; `B*` files are baselines showing the current state at key breakpoints.

---

## 1. Overall state

**The site is in good shape and reads as professionally built.** Nothing is broken, every
route renders, no page hangs, and there is **no placeholder or lorem text, no missing `alt`
attribute, and no console error anywhere** — the single console warning is a known-benign
recharts measurement message. The underlying design system is real and documented.

What holds it back from feeling *finished* is consistency rather than defects. Three
separate typography systems and three separate colour systems are in use side by side, and
a handful of fixed widths break small and mid-size viewports. These are concentrated: a
small number of systemic fixes resolve most of the issue count.

One number is worth stating plainly: **of the 462 raw findings, 324 were a single regression
I introduced in the previous commit** — the showcase strip's controls were 36px tall, below
the 44px touch-target minimum, on every page. That has been fixed (`6f98766`) and is
excluded from the issues below. They were the only touch-target failures in the entire
application.

---

## 2. Issues

Severity: **high** = visibly broken or unusable at a common viewport · **medium** =
noticeably unpolished or an accessibility gap · **low** = cosmetic or a consistency nit.

### H1 — Admin pages scroll horizontally at 768 and 1024

| | |
| --- | --- |
| **Route** | all 11 admin routes: `/admin`, `/admin/dashboard`, `/deliveries`, `/notifications`, `/orders`, `/patients`, `/pharmacies`, `/products`, `/settings`, `/settings/profile`, `/settings/security` |
| **Role / viewport** | ADMIN @ 768 and 1024 |
| **Screenshot** | `A1-admin-dashboard-768-hscroll.png`, `A1-admin-dashboard-1024-hscroll.png` |
| **Severity** | **High** |

The page is 826px wide at a 768px viewport and 1058px at 1024px. The overflowing elements
are the same three on every page — `div.relative`, `button.w-12.h-12` and its `img` — the
avatar control in `AdminHeader`, which sits in a row that does not shrink between the
sidebar breakpoint and the desktop layout.

Verified pre-existing, not caused by the showcase strip: removing the strip at runtime and
re-measuring gives the identical 826px and 1058px.

**Fix:** make the `AdminHeader` action row shrink properly — `min-w-0` on the flexible
child, and allow the search field to compress — rather than widening the page. One change
resolves all 11 routes at both viewports.

### H2 — Fixed card min-width overflows small viewports

| | |
| --- | --- |
| **Route / role / viewport** | `/profile` (PATIENT) @ 360 and 390 · `/admin/notifications` (ADMIN) @ 360 |
| **Screenshot** | `A4-patient-profile-360-hscroll.png`, `A2-admin-notifications-360-hscroll.png` |
| **Severity** | **High** |

A card carries a hardcoded minimum width (`div.min-w-275.rounded-2xl` in the crawl output)
that exceeds a 360px viewport once padding is taken into account, so the page scrolls
sideways and the card's right edge is clipped.

**Fix:** replace the fixed `min-w-*` with `w-full` plus a `max-w-*` cap, so the card fills
narrow screens and stops growing on wide ones.

### H3 — Patient orders scrolls horizontally at 768

| | |
| --- | --- |
| **Route / role / viewport** | `/orders` (PATIENT) @ 768 |
| **Screenshot** | `A5-patient-orders-768-hscroll.png` |
| **Severity** | **High** |

Only at the tablet breakpoint; 360, 390 and desktop widths are clean. The order-card action
row (Track Order / View Details / Cancel Order) does not wrap at that width.

**Fix:** allow the action row to wrap at `md`.

### M1 — Three typography systems in use at once

| | |
| --- | --- |
| **Scope** | whole codebase · all roles · all viewports |
| **Severity** | **Medium** (systemic) |

| System | Occurrences |
| --- | --- |
| Design-system tokens (`text-t-36` … `text-t-8`) | 353 |
| Arbitrary pixel values (`text-[14px]`) | 300 |
| Stock Tailwind (`text-sm`, `text-xl`, …) | 519 |

`docs/design-system/TOKENS.md` documents a deliberate scale — **36 / 30 / 25 / 21 / 17 / 14
/ 12 / 10 / 8**. The arbitrary values in use include **16, 18, 20, 24, 40, 13 and 11px**,
none of which are on it. Nine components mix all three systems in a single file, among them
`AdminHeader`, every `home/sections/*` component, and `CheckoutSidebar`.

This is the single biggest contributor to the "not quite finished" feel: headings on
different pages are a different size for no reason.

**Fix:** map every arbitrary and stock size onto the nearest documented token, then keep
`text-t-*` as the only sanctioned API. Mechanical and low-risk, but it touches many files,
so it should be its own PR with careful visual diffing.

### M2 — Text below the 12px floor on the admin dashboard

| | |
| --- | --- |
| **Route / role / viewport** | `/admin` and `/admin/dashboard` (ADMIN) @ 360, 390, 768 |
| **Screenshot** | `A3-admin-dashboard-360-tinytext.png` |
| **Severity** | **Medium** |

Seven text runs render below 12px, including the stat-card deltas `+2.43%` and `+15.43%` at
**10px** and the caption `from last week` at **9px**. 9px is not on the type scale at all
and is uncomfortable to read on a phone.

**Fix:** raise to `text-t-12` on mobile, allowing `text-t-10` only for true micro-labels.

### M3 — Four different currency formats

| | |
| --- | --- |
| **Route / role / viewport** | mixed formats on the same page: `/` (PATIENT) at every width |
| **Screenshot** | `A6-patient-home-1440-currency.png` |
| **Severity** | **Medium** |

Source analysis finds all four of `$2.50`, `2.50$`, `2.50 $` and `10.50USD` shipping — 21
occurrences of trailing `" $"`, 5 of trailing `"$"`, plus leading-`$` and `USD` suffix
forms. The patient home shows two of them simultaneously.

**Fix:** one `formatCurrency(amount, currency)` helper, used everywhere. This also fixes the
inconsistent decimals seen alongside it.

### M4 — Heading structure

| | |
| --- | --- |
| **Route / role** | 11 auth routes start at `h2` with no `h1`; 9 routes jump `h1 → h3` |
| **Screenshot** | `A7-auth-signin-1440-headings.png` |
| **Severity** | **Medium** |

No `h1`: `/auth`, `/auth/sign-in`, `/auth/sign-up`, `/auth/verify-otp`, `/auth/verify-phone`,
`/auth/forgot-password` (+ `/verify`, `/new-password`), `/auth/pharmacy/sign-in`,
`/auth/pharmacy/sign-up`, `/auth/registration-submitted`, `/pharmacies/202`.
`h1 → h3` skips: `/categories`, `/categories/21`, `/medicines`, `/pharmacies`, `/admin`,
`/admin/dashboard`, `/admin/deliveries`, `/admin/products`.

**Fix:** promote each page's visual title to `h1` and close the level gaps. Purely semantic —
the existing `text-t-*` classes keep the visual size unchanged.

### M5 — Colour is applied three ways

| | |
| --- | --- |
| **Scope** | whole codebase |
| **Severity** | **Medium** (systemic) |

866 semantic token usages, **474 hardcoded hex values**, and 682 stock Tailwind palette
classes. `#334eac` — which *is* `--color-primary` — appears **108 times** hardcoded, in
mixed casing (`#334eac` 69×, `#334EAC` 39×). Others repeated heavily: `#EFEDED` (37),
`#393737` (35), `#989593` (32).

**Fix:** replace hardcoded hex with the token that already holds the value. Mostly
find-and-replace; the risk is the handful of hex values that are *not* an exact token match
and need a decision.

### M6 — Animation ignores reduced-motion preference

46 components import `framer-motion`; only **13** call `useReducedMotion`. The remaining 33
animate regardless of the visitor's OS setting.

**Fix:** apply the pattern already used correctly in `AnnouncementsBar` and `ShowcaseBar`.

### M7 — Focus visibility is thin

93 `focus:` rules against only **20** `focus-visible:`, with `outline-none` appearing in 40
files. Keyboard users will lose the focus ring in places.

**Fix:** a shared focus-ring utility applied to interactive elements; never `outline-none`
without a replacement indicator.

### L1 — Quick chips truncate at 360

`A4-patient-profile-360-hscroll.png` shows `Order · Out f…`, `Prescription …`,
`Calendar · M…`, `Notification ·…`. Readable but visibly cut. **Fix:** drop the status
suffix below `sm` and show the label alone.

### L2 — `/profile` is titled "Settings"

The patient profile page's `h1` reads **Settings** while the route and navigation call it
Profile (`A4`). **Fix:** retitle to match the navigation.

### L3 — recharts measurement warning

`/pharmacy/report` (PHARMACY) logs `width(-1) and height(-1)` once per load at all six
widths (`A8`). Verified benign — the chart settles at 670×284 and renders all bars — but it
is the only console output left in the app. **Fix:** give the chart an explicit height so
the first measurement is valid.

### L4 — Mixed date formats

More than one of `YYYY-MM-DD`, `D/M/YYYY` and `Mon D, YYYY` appears across pages. **Fix:**
fold into the same formatting helper as M3.

### L5 — The container scale is a trap

This project remaps Tailwind's container scale to **breakpoint widths**: `max-w-md` is
**768px**, `max-w-2xl` is **1440px** — not 448px and 672px. Anyone reading these class names
with stock Tailwind in mind will size a container 2–3× too wide. `ConfirmActionModal` uses
`max-w-md` and is therefore 768px wide. I hit this while building the welcome dialog.

**Fix:** either rename the custom scale (e.g. `max-w-screen-*`) or document it prominently
in `TOKENS.md`. **This needs your decision — see §4.**

---

## 3. Systemic versus one-off

**Systemic — fix once, many pages improve**

| Fix | Resolves | Est. files |
| --- | --- | --- |
| S1 · Typography consolidation onto the documented scale (M1) | the dominant consistency problem, all roles | ~60 |
| S2 · Colour consolidation onto tokens (M5) | 474 hardcoded hex, casing inconsistency | ~50 |
| S3 · `formatCurrency` / `formatDate` helpers (M3, L4) | every price and date in the app | ~20 |
| S4 · Shared focus-ring utility (M7) | keyboard accessibility everywhere | ~30 |
| S5 · Reduced-motion pattern applied to the remaining components (M6) | 33 components | 33 |
| S6 · Heading-level pass (M4) | 20 routes | ~20 |

**One-off**

| Fix | Scope |
| --- | --- |
| O1 · `AdminHeader` shrink behaviour (H1) | 1 file, clears 11 routes at 2 viewports |
| O2 · Card `min-w` → `w-full` + `max-w` (H2) | 2 files |
| O3 · Order-card action row wraps at `md` (H3) | 1 file |
| O4 · Admin stat-card text sizes (M2) | 1–2 files |
| O5 · Quick-chip labels at 360 (L1) | 2 files |
| O6 · `/profile` title (L2) | 1 file |
| O7 · Chart explicit height (L3) | 1 file |

---

## 4. Proposed order of work

1. **Pass 1 — the three high-severity overflows** (O1, O2, O3). Small, contained, and the
   only issues a visitor would call broken. *Half a day.*
2. **Pass 2 — the quick one-offs** (O4–O7). *Half a day.*
3. **Pass 3 — currency and date helpers** (S3). Self-contained, visible payoff. *Half a day.*
4. **Pass 4 — typography consolidation** (S1). The big one, and the biggest visual gain.
   Own PR, reviewed against before/after screenshots at all six widths. *1–2 days.*
5. **Pass 5 — colour consolidation** (S2). Same shape as pass 4. *1 day.*
6. **Pass 6 — accessibility** (S4, S5, S6). *1 day.*

Each pass ends with the existing verification script plus a fresh crawl, so regressions like
the 36px touch targets are caught rather than shipped.

### Decisions I need from you

1. **The container scale (L5).** Rename it to something unambiguous, or leave it and document
   it loudly? Renaming touches every `max-w-*` in the codebase; documenting is free but the
   trap stays.
2. **Typography scope (S1).** Convert everything to `text-t-*`, or only the off-scale values
   (13px, 11px, 16px, 18px, 20px, 24px, 40px) and leave stock Tailwind classes that already
   land on-scale? The first is consistent, the second is a fraction of the diff.
3. **Does visual change need sign-off?** Passes 4 and 5 will shift some sizes and shades by a
   few pixels or a shade. I can keep every change pixel-identical where a token matches
   exactly and list the ones that cannot, or I can snap to the nearest token and accept small
   visual drift.
4. **Admin `h1` wording.** Several admin pages have no obvious title element to promote. Happy
   to add visually-hidden `h1`s, or add visible ones — your call.

---

## 5. Already good — do not touch

- **No placeholder content anywhere.** No lorem ipsum, no "Test User", no TODO strings in
  rendered output, across all 324 page loads.
- **Images.** 81 `next/image` against a single raw `<img>`, and every visible image has an
  `alt` attribute. No stretched or badly cropped images found.
- **Empty, loading and error states.** A full set already exists and is used consistently:
  `EmptyState`, `Skeleton`, `ErrorMessage`, `InlineError`, `ErrorBoundary`, `SectionError`,
  plus per-feature variants (`OrderEmptyState`, `SearchEmptyState`, `EmptySavedMedicine`,
  `ProductGridSkeleton`, `MedicineDetailsSkeleton`, `ReportSkeleton`). They look intentional.
- **Console hygiene.** Zero errors on every route in every role at every width.
- **The design system itself.** `TOKENS.md` is a real document, 48 sections covering colour,
  type, spacing, radius, shadows, buttons and inputs. The work below is about *using* it
  consistently, not replacing it.
- **Patient and pharmacy responsive behaviour.** Apart from the two specific cases above,
  both portals are clean from 360 to 1440 — sidebars, drawers and modals all behave.
- **Admin tables.** They scroll inside their own container rather than breaking the page, and
  the row/pagination layout holds up from 360 upward (`B-admin-patients-1024.png`,
  `B-admin-pharmacies-360.png`).

---

## Outcome

Fixed on `feat/showcase-polish` and verified by re-running the same audit over
all **324 pages** (54 role-routes x 6 widths).

| Category | Before | After |
| --- | ---: | ---: |
| Horizontal scroll | 26 | **0** |
| Heading order | 87 | **0** |
| Text under 12px | 13 | **0** |
| Currency formats | 6 | **0** |
| Touch targets under 44px | 66 distinct controls | **0 actionable** |
| Placeholder text / missing alt / navigation failures | 0 | **0** |
| Console errors | 0 | **0** |

The re-run reports 232 touch-target findings, and every one falls into one of
the three documented exclusions below: 244 occurrences of a text input, 30 of a
link inside running text (`Sign Up`, `Login Here`), and 6 of the dial-code
`<select>`. No button, icon control, card action, breadcrumb or navigation item
is under 44px at any width in any role.

### Hit areas: measured, and proved visually inert

Comparing `540f414` (the commit before the hit-area work) with the branch tip,
same build, same widths:

| Page @ width | Controls under 44px, before | After | Control count |
| --- | ---: | ---: | ---: |
| patient home @360 / @390 | 22 / 23 | **0 / 0** | 44 |
| patient search @360 / @390 | 7 / 7 | **0 / 0** | 12 |
| patient profile @360 / @390 | 13 / 13 | **0 / 0** | 22 |
| pharmacy home @360 / @390 | 13 / 13 | **0 / 0** | 18 |
| pharmacy orders @360 / @390 | 24 / 24 | **0 / 0** | 29 |
| admin dashboard @360 / @390 | 17 / 17 | **0 / 0** | 47 |
| admin settings @360 / @390 | 8 / 8 | **0 / 0** | 38 |
| admin notifications @360 / @390 | 29 / 31 | **0 / 0** | 61 |

236 failing controls to zero. The control count is identical on both sides, so
nothing was added or removed. Screenshotting the same 16 pages on both builds
and differencing them pixel by pixel: **14 of 16 are byte-for-byte identical**;
`pharmacy-home` differs by 13 and 17 pixels at a maximum channel delta of 1,
which is text anti-aliasing. Nothing visible moved, resized or changed colour
(`T-*-before.png` / `T-*-after.png`).

The named controls are all covered: the CUREWAY logo link, the voice-search
button, the cart button and the pharmacy sidebar items all measure 44px or more
at 360 and 390 while painting exactly as before.

### Three corrections to this document

1. **"They were the only touch-target failures in the entire application" was
   wrong.** The audit capped its evidence list at four items per page, and the
   showcase strip's four controls filled every slot, hiding the rest. There
   were 66 distinct sub-44px controls, not 4. All of them are now fixed.
2. **Issue M3 overstated the currency problem on the pharmacy pages.** The
   audit's currency check matched a number and a `$` sitting in *different*
   blocks, so a cell reading `1` beside a cell reading `$7.50` looked like a
   mixed format. The patient-home finding was real and is fixed; the pharmacy
   ones were an artefact. The detector has been corrected.
3. **The first count of seven remaining failures included four that were real.**
   The admin settings breadcrumb was marked up as a `<p>`, so the rule that
   exempts links in running text swallowed it and its links stayed 18px tall. A
   breadcrumb is navigation, so it is now a `<nav aria-label="Breadcrumb">`,
   which renders identically (the pixel diff above covers this page). Only the
   three genuine exclusion classes remain.

All of these were faults in the audit tooling or in the first pass of the fix, which has been fixed alongside
the application: the overflow detail no longer reports elements that are
scrolling correctly inside an `overflow-x-auto` container, and the touch-target
check now measures the effective hit area rather than the painted box.

### Deliberately not fixed

- **M5, hardcoded hex colours.** 474 hex values and 682 stock-palette classes,
  including `#334eac` 108 times, remain. They are invisible to a visitor and
  the change is broad and risky, so it is deferred. **This is the main piece of
  outstanding cleanup** and is worth its own PR: replace each hex with the token
  that already holds the value, deciding case by case on the handful that are
  not an exact token match.
- **Text inputs under 44px.** An invisible overlay would sit on top of the
  field and swallow the caret. Reaching 44px means changing their visible
  height, which the brief ruled out.
- **Links inside running text** ("Forgot password?", "Sign Up", "Login Here").
  The WCAG target-size rule exempts them, and a 44px box would overlap the
  lines above and below. The corollary is a trap worth knowing: navigation
  wrapped in a `<p>` inherits this exemption and silently loses its hit area.
- **The dial-code `<select>`** on the sign-up forms. A replaced element paints
  no pseudo-elements, so the hit-area rule cannot reach it; the browser sizes
  it from its own control chrome, and growing it would change the visible
  layout, which the brief ruled out. It is the only `<select>` in the app that
  measures under 44px.
- **Display type at 48, 56 and 80px** in the marketing hero. These sit above
  the scale's 36px ceiling on purpose; snapping them down would be a visible
  jump.
- **Arbitrary font sizes that already land on the scale** (12, 14, 30, 36px).
  Converting them to `text-t-*` is churn with no visual effect.

### Found while fixing, not in the original audit

- `text-t-16`, `text-t-18`, `text-t-20` and `text-t-24` are used 30 times
  across 16 files but are **not defined**, so those elements silently applied
  no font size at all. Mapped to the nearest real step.
- The patient pharmacy detail route was broken: it looked pharmacies up by ids
  `PH001`–`PH005` while the medicine page linked with the numeric fixture id,
  so clicking a pharmacy from a medicine landed on "Pharmacy not found".
- That same data was Tunisia-themed — five entries all named "City Pharmacy"
  at Tunis addresses — inconsistent with the Gaza sample data everywhere else.
- Two further currency formats beyond the four listed in M3: a hardcoded
  `" ILS"` suffix in the pharmacy orders table and `{currency} {amount}` in
  admin orders.
- Five overlays were sized with the remapped container scale and rendered at
  roughly twice their intended width; `EditProfile` was a 1440px "modal".

---

## Verification

`node scripts/verify-showcase.mjs` against the production build:

```
routes checked (role x route) : 76
external requests ATTEMPTED   : 0
benign framework warnings     : 14 (excluded by name, listed in the output)
pages with issues             : 0
```

The purchase flow completes end to end — medicine → cart → checkout → Place
Order → Confirm — and the order list goes from 6 to 7 with the new order
present. Pharmacy and admin tables all populate. Lint 0 errors and 1 known
`exhaustive-deps` warning, typecheck clean, build 53/53.

## Before / after evidence

Captured on two builds of the same tree: `f0cbfb3` (branch point) and the
branch tip, at device scale 2, then downscaled.

| Pair | Issue | What changed |
| --- | --- | --- |
| `C-H1-admin-header-768-*` | H1 | page width 826 → 768; the avatar was clipped off-screen and now sits inside the header |
| `C-H2-patient-profile-360-*` | H2 | page width 409 → 360 |
| `C-H3-patient-orders-768-*` | H3 | page width 863 → 768 |
| `C-M2-admin-dashboard-390-*` | M2 + the strip | the strip wrapped one word per line with the role switcher sitting on top of the text; it now reads as prose in two rows, and no dashboard text is under 12px |
| `C-M3-currency-home-1440-*` | M3 | every price on the page is `$0.00` |
| `C-drift-home-390-*`, `C-drift-cart-1440-*` | M1 | the typography consolidation at the two widths the brief named, for judging visual drift |
| `T-*-before` / `T-*-after` | touch targets | pixel-identical pairs — the hit areas changed nothing visible |
