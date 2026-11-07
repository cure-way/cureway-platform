# CureWay Design Spec

One set of layout, type and component rules for all three areas — patient,
pharmacy and admin — so they read as one product.

This spec **implements** `docs/design-system/TOKENS.md`. It adds no new colour,
font or radius; it decides which existing token to use in which role, and fixes
the sizes that were chosen ad hoc. Brand colours, the logo, the showcase strip,
the welcome dialog and every behaviour stay as they are.

---

## 1. What the audit found

Every route, all three roles, at 1440 and 390 — 108 pages measured.

### Page titles

| Role | Variants at 1440 | Sizes / weights seen |
| --- | ---: | --- |
| Patient | **8** | 24/600, 24/700, 30/700, 36/400, 36/600, 36/700, 48/700, 56/800 |
| Pharmacy | 1 | 18/600 — and it is not the page's first `h1` |
| Admin | 1 | 17/400 |

A patient page title is **48px**; the same thing in admin is **17px and not
even semibold**. That single spread is most of why the three areas feel like
three products.

Five patient pages have no visible title at all, because the title is a styled
`<div>` rather than a heading — `/profile/saved-medicine` renders
`text-[48px]` on a `div`.

Pharmacy pages carry **two `h1` elements**: the sidebar logo and the page
title. The logo comes first in DOM order, so the page's real title is the
second `h1`.

### Containers and alignment

Left edge of the first content block:

| Role | At 1440 | At 390 |
| --- | --- | --- |
| Patient | **7 different edges** — 0, 64, 80, 96, 170, 208, 516 | 6 — 0, 12, 16, 24, 51, 64 |
| Pharmacy | 280, 288 | 24, 32 |
| Admin | 280 | 0 |

On Upload Prescription the header block sits at x=80 and the content cards at
x=208: the two halves of one page do not share an edge. On Saved Medicine the
title sits at x=170 while the quick-action chips directly above it sit at x=32.

**Six container classes are dead.** `max-w-xs`, `max-w-3xl`, `max-w-4xl`,
`max-w-5xl`, `max-w-6xl` and `max-w-7xl` compile to
`max-width: var(--container-5xl)` and friends, and those variables are not
defined in the theme. The declaration is invalid, so **no max-width is applied
at all** — the element is full width. 19 uses across the app, and it is why the
Upload Prescription header (`max-w-7xl`) and its body (`max-w-5xl`) do not line
up: neither constraint exists, and the two blocks are sized by different
ancestors instead.

This is the same class of bug as the undefined `text-t-16/18/20/24` tokens
found in the previous pass.

### Type

Three systems, in near-equal use:

| System | Uses |
| --- | ---: |
| Design tokens (`text-t-*`) | ~480 |
| Stock Tailwind (`text-sm`, `text-2xl`, …) | 519 |
| Arbitrary pixels (`text-[14px]`) | 167 |

The single most common text style in the app is **17px at weight 400** — 308
occurrences. That is the "oversized, light-weight card text": body copy one
step too large and a weight too thin, which is what makes cards look washed
out.

Weight census over all visible text at 1440: `400` 1193, `500` 701, `600` 619,
`700` 198, `900` 26.

**`text-t-N font-semibold` does not work.** The `.text-t-*` classes are defined
inside `@layer utilities`, *after* Tailwind generates `.font-semibold`, and each
one sets `font-weight` itself. Same layer, same specificity, later wins — so
`text-t-21 font-semibold` renders at **weight 400**. There are **176 such
combinations across 61 files**, every one of them silently losing its weight.
This is the main reason section titles and card headings look washed out.

Two fixes, both needed:

- Use the paired tokens (`text-t-21-semibold`), which is what §4 mandates.
- Move the typography block from `@layer utilities` to `@layer components`, so
  `font-*` utilities can override it and the combination stops failing
  silently. Done in the rollout, not the pilot, because it changes every page
  at once.

### Controls

| Element | Distinct variants at 1440 |
| --- | ---: |
| Input / search height | **9** — 20, 24, 36, 38, 46, 48, 54, 56, 64px |
| Button (height + size + weight + radius) | **40** |
| Card (radius + padding) | **28** |
| SVG icon size | **19** |

Saved Medicine's search field is 64px tall with a 16px radius; the same control
in admin is 38px with a pill radius.

### Illustrations

Decorative images run from 96px to 578px with no ceiling. The Upload
Prescription paperclip is 144px square inside a card whose body text is 16px —
nine times the type size.

### Components that already exist

Three separate `PageHeader` components, none of them shared:

| File | Title | Subtitle | Back | Actions |
| --- | --- | --- | --- | --- |
| `patient/PageHeader.tsx` | `text-t-36` bold | `text-t-21` semibold | `text-t-21` bold | no |
| `pharmacy/shared/PageHeader.tsx` | `text-lg` semibold + icon | `text-sm` | no | no |
| `admin/shared/PageHeader.tsx` | `text-t-17 sm:text-t-25` bold + icon | `text-t-14 sm:text-t-17` | no | **yes** |

Plus `prescriptions/UploadHeader.tsx` (48px title, 24px subtitle, 20px Back)
and pages that inline their own.

The admin one is closest to right and is the basis for the shared component
below. `shared/Button.tsx` has a `primary` variant that is **`bg-black`**, not
brand blue.

---

## 2. Layout

### PageContainer

One component, `src/components/shared/PageContainer.tsx`. Every page's header
and body go inside the same instance, so they always share a left and right
edge.

| Breakpoint | Horizontal padding |
| --- | ---: |
| base (<768) | 16px |
| md (≥768) | 24px |
| lg (≥1024) | 32px |

Max content width:

| Variant | Width | Use |
| --- | ---: | --- |
| `default` | **1120px** | every content page in all three roles |
| `wide` | **1440px** | dashboards and full-bleed data tables only |

`wide` is justified only where a page is a grid of charts and tables that would
otherwise be squeezed: the admin dashboard, admin list pages and the pharmacy
report. Everything else is `default`. 1120px keeps a comfortable measure for
cards and forms; 1440px matches `--container-2xl`, which is already defined.

Vertical rhythm inside the container: `py-6` (24px) at base, `py-8` (32px) from
`md`. Sections are separated by `space-y-6` (24px).

**Never** use `max-w-xs`, `max-w-3xl`, `max-w-4xl`, `max-w-5xl`, `max-w-6xl` or
`max-w-7xl` — they are dead classes. Use `PageContainer`, or an explicit value
such as `max-w-[28rem]` for a dialog or a form column.

### Dashboard shell

Pharmacy and admin share one shell so the two portals match:

- sidebar, then `PageContainer` with `wide`
- `PageHeader` at the top of every route, with the optional icon
- `space-y-6` between sections
- stat cards in a `grid gap-4` (16px), tables in a card
- the sidebar logo is **not** an `h1`; the page title is the only `h1`

---

## 3. PageHeader

One component, `src/components/shared/PageHeader.tsx`, used by every route in
every role.

```
[back]  Title                                  [actions]
        Subtitle
```

| Part | Desktop (≥768) | Mobile | Token |
| --- | --- | --- | --- |
| Title | 30px semibold | 21px semibold | `text-t-21-semibold md:text-t-30-semibold` |
| Subtitle | 14px regular, muted | 14px regular, muted | `text-t-14 text-neutral-dark` |
| Back | 14px medium + 20px chevron | same | `text-t-14 font-medium` |
| Actions | right-aligned slot | wraps below on mobile | — |

Rules:

- The title is always the page's `h1`, and the only one.
- Back is a **small icon+text control aligned with the title**, not a heading.
  It sits on the left, before the title, where a back control belongs — not
  floated to the far right at heading size.
- The subtitle is optional and never larger than body text.
- Bottom margin `mb-6` (24px).

This replaces all four existing header components. The icon slot is kept so the
dashboard areas keep their visual cue.

---

## 4. Type roles

Every role maps to an existing token. No new sizes.

| Role | Token | Size / weight |
| --- | --- | --- |
| Page title | `text-t-30-semibold` (`text-t-21-semibold` mobile) | 30 / 21, 600 |
| Section title | `text-t-21-semibold` | 21, 600 |
| Card title | `text-t-17-semibold` | 17, 600 |
| Body | `text-t-14` | 14, 400 |
| Body emphasis | `text-t-14-semibold` | 14, 600 |
| Meta / caption | `text-t-12` | 12, 400 |
| Price | `text-t-17-semibold` (`text-t-21-semibold` on a detail page) | 17 / 21, 600 |
| Label | `text-t-12-semibold` | 12, 600 |
| Button text | `text-t-14-semibold` (`text-t-12-semibold` on `sm`) | 14 / 12, 600 |

Rules:

- **Body text is 14px, not 17px.** The 308 uses of 17px/400 become
  `text-t-14`; 17px stays for card titles and prices, at weight 600.
- **No weight below 400 for body text**, and no `font-light` anywhere.
- Weight 800 and 900 are not in the system — use 700 (`-bold`) at most, and
  only for a price or a stat figure.
- Mobile floor stays 12px for anything a visitor reads.
- Stock Tailwind type classes (`text-sm`, `text-2xl`, …) and arbitrary pixel
  sizes are replaced by the token nearest the intended role, not the nearest
  number — a 48px title becomes a 30px page title because that is its role.

Display type above 36px is allowed **only** in the marketing hero on `/`.

---

## 5. Components

### Buttons

| Size | Height | Text | Padding | Radius |
| --- | ---: | --- | ---: | --- |
| `sm` | 36px | `text-t-12-semibold` | 12px | `rounded-lg` |
| `md` | 44px | `text-t-14-semibold` | 16px | `rounded-lg` |
| `lg` | 52px | `text-t-17-semibold` | 24px | `rounded-lg` |

`md` is the default. `lg` is for a single primary action that owns the view (a
form submit, "Upload file"). Radius is `rounded-lg` (8px) everywhere — not 12,
16, 24 or pill, except a deliberate pill for a filter chip.

Variants stay as the token doc defines them: `primary` is brand blue
(`bg-primary`), `outline` is a brand-blue border on white. **`primary` is never
`bg-black`** — `shared/Button.tsx` is corrected.

### Inputs and search

**One height: 44px** (`input-md`), 14px text, `rounded-lg`, across every role.
`sm` (36px) is allowed only inside a dense table toolbar. `lg` (52px) only on
auth screens, where the form is the whole page.

A search field is an input with a 20px leading icon and the same 44px height.
Saved Medicine's 64px search becomes 44px.

### Cards

| Property | Value |
| --- | --- |
| Radius | `rounded-xl` (12px); `rounded-2xl` (16px) for a feature card |
| Padding | `p-4` (16px) base, `p-6` (24px) from `md` |
| Gap inside | `gap-3` (12px) |
| Gap between | `gap-4` (16px) |
| Shadow | `shadow-card` |
| Border | `border border-border`, or shadow — **not both** |

A card never nests inside another bordered container that repeats its frame.
Saved Medicine's grid currently sits inside a `rounded-[24px] border` wrapper
that double-frames every card; the wrapper goes.

### Tables

Header row `text-t-12-semibold` muted, uppercase off. Body cells `text-t-14`.
Row height 56px, cell padding `px-4 py-3`. The table lives in a card with
`p-0` and its own `rounded-xl` clipping. Horizontal scroll container keeps
`min-w-0` on the flex parent.

### Stat cards

Label `text-t-12` muted, figure `text-t-30-semibold` (`text-t-25-semibold` on
mobile), delta `text-t-12-semibold` in success or error. Padding `p-4`,
`rounded-xl`, `gap-2`. Identical in pharmacy and admin.

### Empty states

Illustration at most **120px**, title `text-t-17-semibold`, body `text-t-14`
muted, one `md` primary action. Centred, `py-12`.

### Illustrations and icons

| Use | Max size |
| --- | ---: |
| Inline with text | 16px |
| Control / button icon | 20px |
| Header icon | 24px |
| Feature or empty-state illustration | **120px** |
| Hero illustration (`/` only) | unrestricted |

The Upload Prescription paperclip drops from 144px to 120px.

---

## 6. Order of work

1. `PageContainer` and `PageHeader` in `src/components/shared/`.
2. Pilot: `/profile/saved-medicine`, Upload Prescription, pharmacy orders,
   admin dashboard.
3. Roll out per area — patient, then pharmacy, then admin — replacing the three
   old header components and the dead container classes as each page is
   touched.
4. Delete `patient/PageHeader.tsx`, `pharmacy/shared/PageHeader.tsx`,
   `admin/shared/PageHeader.tsx` and `prescriptions/UploadHeader.tsx` once no
   route imports them.

## 7. Out of scope

Brand colours, the logo, fonts, the showcase strip, the welcome dialog, and any
behaviour. Hardcoded hex values are a separate cleanup already noted in
`docs/site-review-plan.md`; this pass does not widen into them beyond the
controls it rebuilds.

---

## 8. Pilot result

Four pages implemented against this spec. Before/after at 1440 and 390 in
`docs/design-screenshots/`.

| | Before | After |
| --- | --- | --- |
| Page title | 48px bold `<div>` (saved medicine), 48px `<h1>` (upload), 18px (pharmacy), 17px regular (admin) | **30px semibold `<h1>`** everywhere, 21px on mobile |
| Subtitle | 21–24px semibold | **14px regular, muted** |
| Back | 25px bold, floated right | **14px medium control, left, above the title** |
| Search / input | 64px tall, 16px radius | **44px, `rounded-lg`** |
| Card body text | 17px regular | **14px regular**, titles 17px semibold |
| Card frame | `rounded-[24px]` + border + shadow, inside another bordered box | **`rounded-xl`, shadow only, no double frame** |
| Container | 7 different left edges across patient pages | **one `PageContainer`**, header and body always aligned |
| Illustration | 144px paperclip | **120px** |
| Table rows | 64px, 14px semibold headers | **56px, 12px semibold headers**, 14px body |
| Sample data | six identical Voltaren entries | **six distinct medicines** with their own images and prices |

Also fixed while piloting:

- The pharmacy sidebar logo was an `<h1>`, so every pharmacy page had **two**
  `h1` elements and the page's real title was the second one. It is a brand
  mark, so it is now a `<span>`.
- The pharmacy orders table rendered its Total column as a raw number
  (`7.5`), the one place left in the app showing an unformatted price. It now
  goes through `formatCurrency`.

### Known gap, for the rollout

On patient routes the quick-action chip row sits in the shell, outside
`PageContainer`, so it still runs to a different edge than the page below it.
The patient shell needs the same container treatment as the dashboard shell —
one line in the patient layout, done in the rollout rather than the pilot so
it does not change every patient page at once.

---

## 9. Route → page type → container variant

Every route in all three roles. Pages of the same type share one variant and
therefore land on identical left and right edges at every breakpoint. No page
sets its own max-width.

| Variant | Max width | Measured content edge @1440 | @390 |
| --- | ---: | ---: | ---: |
| `list` | 1120px | x=192, 1056px wide | x=16, 358px |
| `detail` | 960px | x=272, 896px | x=16, 358px |
| `form` | 880px | x=312, 816px | x=16, 358px |
| `account` | 960px | x=272, 896px | x=16, 358px |
| `auth` | 1280px | inside the split-screen form column | x=16, 358px |
| `dashboard` | 1440px | x=288 (pharmacy) / x=312 (admin), after the sidebar | x=16 |

Horizontal padding is 16 / 24 / 32 at base / md / lg for every variant.

### Patient

| Route | Page type | Variant |
| --- | --- | --- |
| `/` | landing (marketing) | `list` for the content block; the promo banner and hero stay full-bleed |
| `/medicines` | listing | `list` |
| `/categories` | listing | `list` |
| `/categories/[id]` | listing | `list` |
| `/pharmacies` | listing | `list` |
| `/search` | listing | `list` |
| `/profile/saved-medicine` | listing | `list` |
| `/cart` | purchase flow (two-column) | `list` |
| `/checkout` | purchase flow (two-column) | `list` |
| `/medicines/[id]` | detail | `detail` |
| `/pharmacies/[id]` | detail | `detail` |
| `/prescriptions` | form / flow | `form` |
| `/profile/edit-profile` | form / flow | `form` |
| `/report-issue` | form / flow | `form` |
| `/location-access` | form / flow | `form` |
| `/Orderconfirmation` | form / flow | `form` |
| `/profile` | account | `account` |
| `/profile/history` | account | `account` |
| `/orders` | account | `account` |
| `/notifications` | account | `account` |
| `/help` | account | `account` |
| `/privacy` | account | `account` |
| `/terms` | account | `account` |

### Auth

`/auth`, `/auth/sign-in`, `/auth/sign-up`, `/auth/verify-phone`,
`/auth/verify-otp`, `/auth/registration-submitted`, `/auth/forgot-password`,
`/auth/forgot-password/verify`, `/auth/forgot-password/new-password`,
`/auth/pharmacy/sign-in`, `/auth/pharmacy/sign-up` — all **`auth`**, applied
once in `AuthShell`'s form column.

### Pharmacy

`/pharmacy`, `/pharmacy/home`, `/pharmacy/orders`, `/pharmacy/orders/[orderId]`,
`/pharmacy/inventory`, `/pharmacy/inventory/[medicineId]`,
`/pharmacy/notifications`, `/pharmacy/profile`, `/pharmacy/report` — all
**`dashboard`**, applied once in `DashboardLayout`.

### Admin

`/admin`, `/admin/dashboard`, `/admin/patients`, `/admin/pharmacies`,
`/admin/orders`, `/admin/deliveries`, `/admin/products`, `/admin/notifications`,
`/admin/settings`, `/admin/settings/profile`, `/admin/settings/security` — all
**`dashboard`**, applied once in `PageShell` (and in the two pages that render
their own stagger container).

### Judgment calls

- **Cart and checkout are `list`, not `form`.** Both are two-column at `xl`;
  an 880px form column would cramp the order summary beside the items. They
  share one variant with each other, which is what the rule asks for.
- **`form` is 880px, not 720px**, so a two-column step inside a flow still has
  room.
- **`account` and `detail` are both 960px.** They are separate names because
  they answer different questions and may diverge; today they measure the same.
- **The landing page keeps its full-bleed promo banner and hero.** Only its
  bordered content block sits on the container, so it aligns with the shell and
  with every listing page.
- **The dashboard content edge differs by 24px between pharmacy and admin**
  because their sidebars are different widths. The containers are identical;
  only the space left over differs.
