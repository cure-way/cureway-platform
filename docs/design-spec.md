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

| Role     | Variants at 1440 | Sizes / weights seen                                           |
| -------- | ---------------: | -------------------------------------------------------------- |
| Patient  |            **8** | 24/600, 24/700, 30/700, 36/400, 36/600, 36/700, 48/700, 56/800 |
| Pharmacy |                1 | 18/600 — and it is not the page's first `h1`                   |
| Admin    |                1 | 17/400                                                         |

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

| Role     | At 1440                                              | At 390                    |
| -------- | ---------------------------------------------------- | ------------------------- |
| Patient  | **7 different edges** — 0, 64, 80, 96, 170, 208, 516 | 6 — 0, 12, 16, 24, 51, 64 |
| Pharmacy | 280, 288                                             | 24, 32                    |
| Admin    | 280                                                  | 0                         |

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

| System                                    | Uses |
| ----------------------------------------- | ---: |
| Design tokens (`text-t-*`)                | ~480 |
| Stock Tailwind (`text-sm`, `text-2xl`, …) |  519 |
| Arbitrary pixels (`text-[14px]`)          |  167 |

The single most common text style in the app is **17px at weight 400** — 308
occurrences. That is the "oversized, light-weight card text": body copy one
step too large and a weight too thin, which is what makes cards look washed
out.

Weight census over all visible text at 1440: `400` 1193, `500` 701, `600` 619,
`700` 198, `900` 26.

**`text-t-N font-semibold` does not work.** The `.text-t-*` classes are defined
inside `@layer utilities`, _after_ Tailwind generates `.font-semibold`, and each
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

| Element                                  |                    Distinct variants at 1440 |
| ---------------------------------------- | -------------------------------------------: |
| Input / search height                    | **9** — 20, 24, 36, 38, 46, 48, 54, 56, 64px |
| Button (height + size + weight + radius) |                                       **40** |
| Card (radius + padding)                  |                                       **28** |
| SVG icon size                            |                                       **19** |

Saved Medicine's search field is 64px tall with a 16px radius; the same control
in admin is 38px with a pill radius.

### Illustrations

Decorative images run from 96px to 578px with no ceiling. The Upload
Prescription paperclip is 144px square inside a card whose body text is 16px —
nine times the type size.

### Components that already exist

Three separate `PageHeader` components, none of them shared:

| File                             | Title                                | Subtitle                 | Back             | Actions |
| -------------------------------- | ------------------------------------ | ------------------------ | ---------------- | ------- |
| `patient/PageHeader.tsx`         | `text-t-36` bold                     | `text-t-21` semibold     | `text-t-21` bold | no      |
| `pharmacy/shared/PageHeader.tsx` | `text-lg` semibold + icon            | `text-sm`                | no               | no      |
| `admin/shared/PageHeader.tsx`    | `text-t-17 sm:text-t-25` bold + icon | `text-t-14 sm:text-t-17` | no               | **yes** |

Plus `prescriptions/UploadHeader.tsx` (48px title, 24px subtitle, 20px Back)
and pages that inline their own.

The admin one is closest to right and is the basis for the shared component
below. `shared/Button.tsx` has a `primary` variant that is **`bg-black`**, not
brand blue.

---

## 2. The frame

One container system for all three areas, after besterra.io.

### Tokens

Declared in `src/styles/global.css`, consumed **only** by `PageContainer`.
No page or component sets a page max-width or horizontal page padding.

| Token             | Value                       | Role                                    |
| ----------------- | --------------------------- | --------------------------------------- |
| `--container-max` | `105rem` (1680px)           | the frame: page chrome and page content |
| `--container-px`  | `clamp(1.25rem, 5vw, 3rem)` | the one gutter, 20px → 48px             |
| `--content-xl`    | 1280px                      | wide multi-column, inside the frame     |
| `--content-lg`    | 1200px                      | standard, inside the frame              |
| `--content-md`    | 768px                       | forms and narrow content                |
| `--content-sm`    | 640px                       | long text, legal                        |

### Components

- **`PageContainer`** always fills the frame. Every route uses it.
- **`ContentColumn width="xl|lg|md|sm"`** is a narrower column _inside_ the
  frame. It is **left-aligned** (`mr-auto`), never centred, so the page header
  above stays at full width and the column starts on the same left edge.
- **`FRAME` / `SHELL_RAIL`** is the same class string, exported for page chrome
  that cannot use the component.

### Patient

The showcase strip, the announcements bar, the header (logo, search, location,
cart, avatar), the quick-action chip row, the page header and the page content
all sit on the frame. Backgrounds and borders stay full-bleed; only the content
is constrained, so every left and right edge in the area matches at every
breakpoint.

Page content fills the frame by default. Single-column forms (edit profile,
report issue, location access, order confirmation) use
`ContentColumn width="md"`; long text (privacy, terms) uses `width="sm"`.

Upload prescription is **not** a narrow-column page: it is a two-column layout
on the frame — the upload flow on the left, context on the right (how it works,
accepted files, the privacy note, recent prescriptions). The grid wraps every
step of the flow, so all six steps keep identical edges, and the columns stack
with the flow first below `lg`.

**What may be full-bleed.** Only a true background image or colour band — a
band of colour or a photograph that is meant to run to the viewport edge.
Everything else goes inside the frame: every card, every bordered box, every
content block, every section. A bordered card is not a background band, however
wide it looks. Text and buttons inside a full-bleed visual still align to the
frame.

The landing page has no full-bleed block: the promo banner is a bordered card,
so it sits on the frame like every other section. It previously ran edge to
edge with its border against the viewport and its illustration clipped.

A decorative wrapper around a group of sections is not allowed to inset them:
it adds its own padding, so no section inside it lines up with the header. The
landing page's bordered wrapper was removed for this reason, and its sections
sit on the frame directly.

### Pharmacy and admin

The two shells are structurally identical:

|                  | Value                                                           |
| ---------------- | --------------------------------------------------------------- |
| Sidebar width    | **280px** (pharmacy was 256px — the whole 24px edge difference) |
| Top bar height   | **80px**, content on the frame                                  |
| Sidebar logo row | **80px**, matching the top bar                                  |
| Page header      | first child of the page container, `mb-6` to content            |
| Section spacing  | `space-y-6` (24px)                                              |

The showcase strip spans the viewport above both shells and sits on the same
frame as the patient area. Dashboard narrow content (settings and profile
forms) follows the patient rule: a left-aligned `ContentColumn` inside the
frame.

Five pharmacy route layouts used to add their own `px-4` wrapper and a second
scroll container on top of the shell; they are gone.

## 2b. Scrollbars

One style everywhere — sidebars, tables, modals, dropdowns, horizontal tab and
chip strips, and the page itself.

| Property       | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| Width / height | 8px                                                                |
| Track          | transparent                                                        |
| Thumb          | `hsl(var(--neutral) / 0.35)`, fully rounded, 2px transparent inset |
| Thumb hover    | `hsl(var(--neutral) / 0.55)`                                       |

Firefox gets `scrollbar-width: thin` and `scrollbar-color`; WebKit and Blink
get `::-webkit-scrollbar*`. On a desktop pointer (`hover: hover and pointer:
fine`) the thumb is transparent until the pointer is over the scroll area;
touch devices keep their platform overlay scrollbars. **The page scrollbar is
the exception** and stays visible, because it is the reader's position
indicator for the document.

Only the painting changes: the scrollbar keeps its width and every scroll
input — wheel, drag, touch, keyboard — is untouched. `.scrollbar-none` is the
opt-out for a carousel that must never show one.

## 3. PageHeader

One component, `src/components/shared/PageHeader.tsx`, used by every route in
every role.

```
[back]  Title                                  [actions]
        Subtitle
```

| Part     | Desktop (≥768)             | Mobile                | Token                                      |
| -------- | -------------------------- | --------------------- | ------------------------------------------ |
| Title    | 30px semibold              | 21px semibold         | `text-t-21-semibold md:text-t-30-semibold` |
| Subtitle | 14px regular, muted        | 14px regular, muted   | `text-t-14 text-neutral-dark`              |
| Back     | 14px medium + 20px chevron | same                  | `text-t-14 font-medium`                    |
| Actions  | right-aligned slot         | wraps below on mobile | —                                          |

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

| Role           | Token                                                        | Size / weight |
| -------------- | ------------------------------------------------------------ | ------------- |
| Page title     | `text-t-30-semibold` (`text-t-21-semibold` mobile)           | 30 / 21, 600  |
| Section title  | `text-t-21-semibold`                                         | 21, 600       |
| Card title     | `text-t-17-semibold`                                         | 17, 600       |
| Body           | `text-t-14`                                                  | 14, 400       |
| Body emphasis  | `text-t-14-semibold`                                         | 14, 600       |
| Meta / caption | `text-t-12`                                                  | 12, 400       |
| Price          | `text-t-17-semibold` (`text-t-21-semibold` on a detail page) | 17 / 21, 600  |
| Label          | `text-t-12-semibold`                                         | 12, 600       |
| Button text    | `text-t-14-semibold` (`text-t-12-semibold` on `sm`)          | 14 / 12, 600  |

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

| Size | Height | Text                 | Padding | Radius       |
| ---- | -----: | -------------------- | ------: | ------------ |
| `sm` |   36px | `text-t-12-semibold` |    12px | `rounded-lg` |
| `md` |   44px | `text-t-14-semibold` |    16px | `rounded-lg` |
| `lg` |   52px | `text-t-17-semibold` |    24px | `rounded-lg` |

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

| Property    | Value                                                        |
| ----------- | ------------------------------------------------------------ |
| Radius      | `rounded-xl` (12px); `rounded-2xl` (16px) for a feature card |
| Padding     | `p-4` (16px) base, `p-6` (24px) from `md`                    |
| Gap inside  | `gap-3` (12px)                                               |
| Gap between | `gap-4` (16px)                                               |
| Shadow      | `shadow-card`                                                |
| Border      | `border border-border`, or shadow — **not both**             |

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

| Use                                 |     Max size |
| ----------------------------------- | -----------: |
| Inline with text                    |         16px |
| Control / button icon               |         20px |
| Header icon                         |         24px |
| Feature or empty-state illustration |    **120px** |
| Hero illustration (`/` only)        | unrestricted |

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

|                | Before                                                                                          | After                                                       |
| -------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Page title     | 48px bold `<div>` (saved medicine), 48px `<h1>` (upload), 18px (pharmacy), 17px regular (admin) | **30px semibold `<h1>`** everywhere, 21px on mobile         |
| Subtitle       | 21–24px semibold                                                                                | **14px regular, muted**                                     |
| Back           | 25px bold, floated right                                                                        | **14px medium control, left, above the title**              |
| Search / input | 64px tall, 16px radius                                                                          | **44px, `rounded-lg`**                                      |
| Card body text | 17px regular                                                                                    | **14px regular**, titles 17px semibold                      |
| Card frame     | `rounded-[24px]` + border + shadow, inside another bordered box                                 | **`rounded-xl`, shadow only, no double frame**              |
| Container      | 7 different left edges across patient pages                                                     | **one `PageContainer`**, header and body always aligned     |
| Illustration   | 144px paperclip                                                                                 | **120px**                                                   |
| Table rows     | 64px, 14px semibold headers                                                                     | **56px, 12px semibold headers**, 14px body                  |
| Sample data    | six identical Voltaren entries                                                                  | **six distinct medicines** with their own images and prices |

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

## 9. Route → page type → container

Every route fills the frame. The "column" column is the narrower
`ContentColumn` inside it, where a page has one; `—` means the page fills the
frame.

| Route                             | Page type     | Column                                                    |
| --------------------------------- | ------------- | --------------------------------------------------------- |
| `/`                               | landing       | — (content block on the frame; hero and promo full-bleed) |
| `/medicines`                      | listing       | —                                                         |
| `/categories`, `/categories/[id]` | listing       | —                                                         |
| `/pharmacies`                     | listing       | —                                                         |
| `/search`                         | listing       | —                                                         |
| `/profile/saved-medicine`         | listing       | —                                                         |
| `/cart`, `/checkout`              | purchase flow | — (two-column)                                            |
| `/medicines/[id]`                 | detail        | —                                                         |
| `/pharmacies/[id]`                | detail        | —                                                         |
| `/orders`                         | account       | —                                                         |
| `/notifications`                  | account       | —                                                         |
| `/profile`, `/profile/history`    | account       | —                                                         |
| `/help`                           | account       | `md` (768px)                                              |
| `/privacy`, `/terms`              | long text     | `sm` (640px)                                              |
| `/prescriptions`                  | form, two-col | — (flow + side panel fill the frame)                      |
| `/profile/edit-profile`           | form          | `md`                                                      |
| `/report-issue`                   | form          | `md`                                                      |
| `/location-access`                | form          | `md`                                                      |
| `/Orderconfirmation`              | form          | `md`                                                      |
| all 11 `/auth/*`                  | auth          | own split-screen shell, frame in the form column          |
| all 9 `/pharmacy/*`               | dashboard     | — (settings/profile forms: `md`)                          |
| all 11 `/admin/*`                 | dashboard     | — (settings forms: `md`)                                  |

## 10. Rollout result

### Design audit — 108 pages, 3 roles, 1440 and 390

| Measure                                    | Before                                                                    | After                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Page-title styles                          | **8** in patient alone (24→56px), 18px in pharmacy, 17px regular in admin | **1** role (`text-page-title`): 30px semibold desktop, 21px mobile      |
| Pages with no visible title                | 5                                                                         | **0** (the one `NONE` is an empty-state render of `/Orderconfirmation`) |
| Patient content left edges @1440           | **7** (0, 64, 80, 96, 170, 208, 516)                                      | **4**, one per variant in use                                           |
| Content edge per variant                   | n/a                                                                       | exactly **one** `(left, width)` pair per variant at each width          |
| Pages inside a shared container            | 0                                                                         | **106 / 108**                                                           |
| Dead container classes                     | 19 uses                                                                   | **0**                                                                   |
| `text-t-N font-semibold` losing its weight | 176 across 61 files                                                       | **0**                                                                   |
| Header components                          | 4                                                                         | **1**                                                                   |

The one remaining 56px title is the landing page's marketing hero, which §4
exempts. The two pages without a container are `/Orderconfirmation`'s empty
and loading states.

### Technical audit — 324 pages

| Category                                    |                                          Result |
| ------------------------------------------- | ----------------------------------------------: |
| Horizontal scroll                           |                                           **0** |
| Heading order                               |                                           **0** |
| Text under 12px                             |                                           **0** |
| Currency formats                            |                                           **0** |
| Placeholder text / missing alt / navigation |                                           **0** |
| Console errors                              |                                           **0** |
| Touch targets under 44px                    | 238, **all** in the three documented exclusions |

The 238 are 258 text-input occurrences, 30 running-text links (`Sign Up`,
`Login Here`) and 6 of the dial-code `<select>`. No button, card action,
breadcrumb or navigation item is under 44px at any width in any role.

### Verification

```
routes checked (role x route) : 76
external requests ATTEMPTED   : 0
benign framework warnings     : 4
pages with issues             : 0
```

Purchase flow completes end to end; the order list goes from 6 to 7. Lint 0
errors with 1 known `exhaustive-deps` warning, typecheck clean, build 53/53.

### Contact sheets

`docs/review-screenshots/sheet-{role}-{width}-{before,after}.png` — one grid
per role per width, grouped by container variant, so pages of the same type sit
side by side and their edges can be compared directly.

### Known gaps

- **Admin sidebar rows stay at 48px.** A navigation row is not a button; the
  spec's three button sizes do not apply to it.
- **The dashboard content edge differs by 24px** between pharmacy and admin
  because the two sidebars are different widths. The containers are identical.
- **Hardcoded hex colours are still outstanding** — 474 values, unchanged from
  `docs/site-review-plan.md`. They are invisible to a visitor and remain the
  main piece of cleanup, worth its own PR.

---

## 11. The frame rollout

### Edge alignment, measured

Left edge in px of each element, every route in the area, at the five widths.
Within an area the figures are identical, and pharmacy matches admin exactly.

| Area     | Width | Strip | Top bar | Chips | Page header | Content |
| -------- | ----: | ----: | ------: | ----: | ----------: | ------: |
| Patient  |   390 |    20 |      20 |    20 |          20 |      20 |
| Patient  |   768 |    38 |      38 |    38 |          38 |      38 |
| Patient  |  1024 |    48 |      48 |    48 |          48 |      48 |
| Patient  |  1440 |    48 |      48 |    48 |          48 |      48 |
| Patient  |  1920 |   168 |     168 |   168 |         168 |     168 |
| Pharmacy |   390 |    20 |      20 |     — |          20 |      20 |
| Pharmacy |   768 |    38 |      38 |     — |          38 |      38 |
| Pharmacy |  1024 |    48 |     328 |     — |         328 |     328 |
| Pharmacy |  1440 |    48 |     328 |     — |         328 |     328 |
| Pharmacy |  1920 |   168 |     328 |     — |         328 |     328 |
| Admin    |   390 |    20 |      20 |     — |          20 |      20 |
| Admin    |   768 |    38 |      38 |     — |          38 |      38 |
| Admin    |  1024 |    48 |     328 |     — |         328 |     328 |
| Admin    |  1440 |    48 |     328 |     — |         328 |     328 |
| Admin    |  1920 |   168 |     328 |     — |         328 |     328 |

The dashboard strip sits above the sidebar and spans the viewport, so it keeps
the patient area's frame edge (48 / 168) while the dashboard content begins
after the 280px sidebar (280 + 48 = 328). That is the intended relationship,
not a mismatch.

Auth routes are excluded: they have their own split-screen shell, and the frame
applies inside the form column.

### Audits

| Check                          |                               Result |
| ------------------------------ | -----------------------------------: |
| Horizontal overflow            |                                **0** |
| Text under 12px                |                                **0** |
| Heading order                  |                                **0** |
| Currency formats               |                                **0** |
| Console errors                 |                                **0** |
| Touch targets                  | 238, all three documented exclusions |
| External requests attempted    |                                **0** |
| Routes verified (role × route) |                                   76 |
| Purchase flow                  |                 intact, orders 6 → 7 |

Lint 0 errors with 1 known `exhaustive-deps` warning, typecheck clean, build
53/53.

### Evidence

- `docs/review-screenshots/sheet-{role}-{1440,1920}-{before,after}.png`
- `docs/review-screenshots/scrollbar-admin-sidebar-{before,after}.png`

---

## 12. Home and upload-flow edge alignment

Left edge in px of every section against the header's, measured on the built
app. Within a page they are identical at every width.

| Element                   | 390 | 768 | 1440 | 1920 |
| ------------------------- | --: | --: | ---: | ---: |
| **Header (topbar)**       |  20 |  38 |   48 |  168 |
| Showcase strip            |  20 |  38 |   48 |  168 |
| Quick-action chips        |  20 |  38 |   48 |  168 |
| Promo banner              |  20 |  38 |   48 |  168 |
| Hero                      |  20 |  38 |   48 |  168 |
| Upload-prescription CTA   |  20 |  38 |   48 |  168 |
| Categories                |  20 |  38 |   48 |  168 |
| Nearby pharmacies         |  20 |  38 |   48 |  168 |
| Most sales                |  20 |  38 |   48 |  168 |
| Bottom CTA                |  20 |  38 |   48 |  168 |
| Home page title (hero h1) |  20 |  38 |   48 |  168 |

`/prescriptions`, every step of the flow:

| Element             | 390 | 768 | 1440 | 1920 |
| ------------------- | --: | --: | ---: | ---: |
| **Header (topbar)** |  20 |  38 |   48 |  168 |
| Showcase strip      |  20 |  38 |   48 |  168 |
| Page title          |  20 |  38 |   48 |  168 |
| Upload flow column  |  20 |  38 |   48 |  168 |
| Side panel          |  20 |  38 |  992 | 1352 |

The side panel is the second column from `lg` up and stacks under the flow
below it, which is why its edge differs at the two wide widths and matches at
the two narrow ones.

Two fixes came out of this measurement:

- The landing page's bordered wrapper inset every section inside it by its own
  padding, so no section matched the header. It is gone.
- The hero used `items-center` on its stacked layout, which centred the text
  column and pushed the `h1` to x=112 at 768. It stretches below `lg` now.
