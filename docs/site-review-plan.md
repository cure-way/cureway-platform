# CureWay — full site review

**Status:** plan only. Nothing in sections 2–4 has been changed. Awaiting approval before any fix.

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
