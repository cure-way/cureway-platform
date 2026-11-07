# CureWay Design System Tokens

This document describes all design tokens available in the CureWay application. These tokens ensure visual consistency across all components and pages.

> **Reference images:** See `public/docs/design-system/` for visual references.

---

## Table of Contents

1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Grid & Breakpoints](#grid--breakpoints)
5. [Border Radius](#border-radius)
6. [Shadows](#shadows)
7. [Buttons](#buttons)
8. [Inputs](#inputs)
9. [Icons](#icons)

---

## Colors

### Color Palettes

The CureWay color system includes six semantic color families, each with 10 shades ranging from light to dark.

#### Primary (CureWay Blue)

The main brand color used for buttons, links, and primary actions.

| Token         | CSS Variable             | Tailwind Class            | Usage                          |
| ------------- | ------------------------ | ------------------------- | ------------------------------ |
| Light         | `--primary-light`        | `bg-primary-light`        | Subtle backgrounds, badges     |
| Light Hover   | `--primary-light-hover`  | `bg-primary-light-hover`  | Hover state for light          |
| Light Active  | `--primary-light-active` | `bg-primary-light-active` | Active/pressed state for light |
| Normal        | `--primary`              | `bg-primary`              | Buttons, links, main CTA       |
| Normal Hover  | `--primary-hover`        | `bg-primary-hover`        | Button hover state             |
| Normal Active | `--primary-active`       | `bg-primary-active`       | Button pressed state           |
| Dark          | `--primary-dark`         | `bg-primary-dark`         | Headers, emphasis              |
| Dark Hover    | `--primary-dark-hover`   | `bg-primary-dark-hover`   | Dark hover state               |
| Dark Active   | `--primary-dark-active`  | `bg-primary-dark-active`  | Dark pressed state             |
| Darker        | `--primary-darker`       | `bg-primary-darker`       | Deepest shade, high contrast   |

**Numbered Scale Alternative:**

```css
/* Use numbered scale for progressive shading */
bg-primary-50   /* Lightest */
bg-primary-100
bg-primary-200
bg-primary-300
bg-primary-400
bg-primary-500  /* Base - same as bg-primary */
bg-primary-600
bg-primary-700
bg-primary-800
bg-primary-900  /* Darkest */
```

#### Secondary

Complementary blue used for secondary actions and accents.

| Token  | Tailwind Class        | Usage                    |
| ------ | --------------------- | ------------------------ |
| Light  | `bg-secondary-light`  | Subtle backgrounds       |
| Normal | `bg-secondary`        | Secondary buttons, links |
| Dark   | `bg-secondary-dark`   | Emphasis text            |
| Darker | `bg-secondary-darker` | High contrast            |

#### Error (Red)

Used for error states, destructive actions, and validation messages.

| Token  | Tailwind Class                | Usage                      |
| ------ | ----------------------------- | -------------------------- |
| Light  | `bg-error-light`              | Error backgrounds          |
| Normal | `bg-error` / `bg-destructive` | Error text, delete buttons |
| Dark   | `bg-error-dark`               | Emphasis                   |

**Example:**

```tsx
<span className="text-error">This field is required</span>
<input className="input-error" />
```

#### Warning (Yellow/Orange)

Used for warning messages and cautionary states.

| Token  | Tailwind Class     | Usage                 |
| ------ | ------------------ | --------------------- |
| Light  | `bg-warning-light` | Warning backgrounds   |
| Normal | `bg-warning`       | Warning icons, badges |
| Dark   | `bg-warning-dark`  | Emphasis              |

#### Success (Green)

Used for success states, confirmations, and positive feedback.

| Token  | Tailwind Class     | Usage                        |
| ------ | ------------------ | ---------------------------- |
| Light  | `bg-success-light` | Success backgrounds          |
| Normal | `bg-success`       | Success messages, checkmarks |
| Dark   | `bg-success-dark`  | Emphasis                     |

**Example:**

```tsx
<input className="input-success" />
<span className="text-success">Password accepted</span>
```

#### Neutral (Gray Scale)

Used for text, borders, backgrounds, and disabled states.

| Token  | Tailwind Class      | Usage                   |
| ------ | ------------------- | ----------------------- |
| Light  | `bg-neutral-light`  | Page backgrounds        |
| Normal | `bg-neutral`        | Placeholder text, icons |
| Dark   | `bg-neutral-dark`   | Secondary text          |
| Darker | `bg-neutral-darker` | Primary text            |

### Semantic Tokens

These tokens are mapped for component theming and shadcn/ui compatibility:

| Token            | CSS Variable         | Usage                        |
| ---------------- | -------------------- | ---------------------------- |
| Background       | `--background`       | Page backgrounds             |
| Foreground       | `--foreground`       | Main text color              |
| Card             | `--card`             | Card backgrounds             |
| Card Foreground  | `--card-foreground`  | Card text                    |
| Popover          | `--popover`          | Popover/dropdown backgrounds |
| Muted            | `--muted`            | Muted backgrounds            |
| Muted Foreground | `--muted-foreground` | Secondary text, placeholders |
| Accent           | `--accent`           | Accent backgrounds           |
| Border           | `--border`           | Border colors                |
| Input            | `--input`            | Input border colors          |
| Ring             | `--ring`             | Focus ring color             |
| Destructive      | `--destructive`      | Destructive action color     |

**Example:**

```tsx
<div className="bg-background text-foreground">
  <div className="bg-card border border-border rounded-lg">
    <p className="text-muted-foreground">Secondary text</p>
  </div>
</div>
```

---

## Typography

Based on the Typography.png reference, the type scale uses specific pixel sizes with three weight variants.

### Font Sizes

| Token   | Size             | Line Height | Tailwind Class |
| ------- | ---------------- | ----------- | -------------- |
| Type@36 | 36px (2.25rem)   | 44px        | `text-t-36`    |
| Type@30 | 30px (1.875rem)  | 38px        | `text-t-30`    |
| Type@25 | 25px (1.5625rem) | 32px        | `text-t-25`    |
| Type@21 | 21px (1.3125rem) | 28px        | `text-t-21`    |
| Type@17 | 17px (1.0625rem) | 24px        | `text-t-17`    |
| Type@14 | 14px (0.875rem)  | 20px        | `text-t-14`    |
| Type@12 | 12px (0.75rem)   | 16px        | `text-t-12`    |
| Type@10 | 10px (0.625rem)  | 14px        | `text-t-10`    |
| Type@8  | 8px (0.5rem)     | 12px        | `text-t-8`     |

### Font Weights

| Weight   | Value | Suffix      |
| -------- | ----- | ----------- |
| Regular  | 400   | (default)   |
| SemiBold | 600   | `-semibold` |
| Bold     | 700   | `-bold`     |

### Combined Typography Classes

```tsx
/* Regular weight */
<h1 className="text-t-36">Page Title</h1>
<h2 className="text-t-30">Section Title</h2>
<p className="text-t-14">Body text</p>

/* SemiBold weight */
<h1 className="text-t-36-semibold">Bold Page Title</h1>
<h2 className="text-t-21-semibold">Subtitle</h2>

/* Bold weight */
<span className="text-t-17-bold">Emphasized text</span>
```

### Semantic Typography Classes

For convenience, semantic aliases are provided:

| Class             | Size | Weight   | Usage             |
| ----------------- | ---- | -------- | ----------------- |
| `text-title`      | 30px | Bold     | Page titles       |
| `text-subtitle`   | 21px | SemiBold | Section headings  |
| `text-body-large` | 17px | Regular  | Large body text   |
| `text-body`       | 14px | Regular  | Default body text |
| `text-caption`    | 12px | Regular  | Captions, labels  |
| `text-small`      | 10px | Regular  | Fine print        |

**Example:**

```tsx
<article>
  <h1 className="text-title">Article Title</h1>
  <h2 className="text-subtitle">Section Heading</h2>
  <p className="text-body">Main content goes here...</p>
  <span className="text-caption text-muted-foreground">Published Jan 2026</span>
</article>
```

---

## Spacing

Based on Spacing.png, the spacing scale uses specific pixel values.

### Spacing Scale

| Value | Pixels | Tailwind Key | Example Classes             |
| ----- | ------ | ------------ | --------------------------- |
| 2px   | 2      | `0.5`        | `p-0.5`, `m-0.5`, `gap-0.5` |
| 4px   | 4      | `1`          | `p-1`, `m-1`, `gap-1`       |
| 8px   | 8      | `2`          | `p-2`, `m-2`, `gap-2`       |
| 12px  | 12     | `3`          | `p-3`, `m-3`, `gap-3`       |
| 16px  | 16     | `4`          | `p-4`, `m-4`, `gap-4`       |
| 20px  | 20     | `5`          | `p-5`, `m-5`, `gap-5`       |
| 24px  | 24     | `6`          | `p-6`, `m-6`, `gap-6`       |
| 32px  | 32     | `8`          | `p-8`, `m-8`, `gap-8`       |
| 40px  | 40     | `10`         | `p-10`, `m-10`, `gap-10`    |
| 48px  | 48     | `12`         | `p-12`, `m-12`, `gap-12`    |
| 56px  | 56     | `14`         | `p-14`, `m-14`, `gap-14`    |
| 64px  | 64     | `16`         | `p-16`, `m-16`, `gap-16`    |
| 80px  | 80     | `20`         | `p-20`, `m-20`, `gap-20`    |

### Exact Pixel Utilities

For precise control, use the pixel-based utilities:

```tsx
<div className="gap-12px">12px gap</div>
<div className="p-24px">24px padding</div>
<div className="m-32px">32px margin</div>
```

**Example Layout:**

```tsx
<section className="py-16 px-6">
  <div className="space-y-8">
    <header className="mb-6">
      <h1 className="text-title">Section</h1>
    </header>
    <div className="grid gap-6">{/* Cards */}</div>
  </div>
</section>
```

---

## Grid & Breakpoints

Based on Grid.png, the system supports responsive layouts from mobile to desktop.

### Breakpoints

| Name  | Min Width | Columns | Usage         |
| ----- | --------- | ------- | ------------- |
| `xs`  | 320px     | 1       | Mobile small  |
| `sm`  | 480px     | 2       | Mobile medium |
| `md`  | 768px     | 8       | Tablet        |
| `lg`  | 1024px    | 8       | Desktop small |
| `xl`  | 1280px    | 12      | Desktop large |
| `2xl` | 1536px    | 12      | Extra large   |

### Container Settings

The container is centered with responsive padding:

```tsx
<div className="container">
  {/* 
    - xs/sm: 16px padding
    - md: 24px padding  
    - lg: 32px padding
    - xl: 40px padding
    - 2xl: 48px padding
  */}
</div>
```

### Page Container

For full-page layouts with max-width:

```tsx
<main className="container-page">
  {/* Max-width: 1440px, centered, responsive padding */}
</main>
```

### Responsive Grid Example

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-6">
  <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
    Card 1
  </div>
  <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
    Card 2
  </div>
</div>
```

---

## Border Radius

Based on the rounded corners in Buttons.png and Inputs.png:

| Token   | Value  | Tailwind Class           | Usage               |
| ------- | ------ | ------------------------ | ------------------- |
| Small   | 4px    | `rounded-sm`             | Badges, tags        |
| Default | 6px    | `rounded` / `rounded-md` | General use         |
| Large   | 8px    | `rounded-lg`             | Buttons, inputs     |
| XL      | 12px   | `rounded-xl`             | Cards               |
| 2XL     | 16px   | `rounded-2xl`            | Modals, large cards |
| 3XL     | 24px   | `rounded-3xl`            | Feature cards       |
| Full    | 9999px | `rounded-full`           | Pills, avatars      |

**Example:**

```tsx
<button className="rounded-lg">Button</button>
<div className="rounded-xl border">Card</div>
<span className="rounded-full bg-primary px-3 py-1">Badge</span>
```

---

## Shadows

| Token       | Tailwind Class       | Usage                |
| ----------- | -------------------- | -------------------- |
| Small       | `shadow-sm`          | Subtle elevation     |
| Default     | `shadow`             | Standard cards       |
| Medium      | `shadow-md`          | Elevated cards       |
| Large       | `shadow-lg`          | Modals, dropdowns    |
| XL          | `shadow-xl`          | Popovers             |
| 2XL         | `shadow-2xl`         | High elevation       |
| Card        | `shadow-card`        | Standard card shadow |
| Input Focus | `shadow-input-focus` | Input focus ring     |

**Example:**

```tsx
<div className="shadow-card rounded-xl bg-card p-6">
  Card content
</div>

<input className="focus:shadow-input-focus" />
```

---

## Buttons

Based on Buttons.png, the button system supports variants, sizes, and states.

### Button Classes

#### Base Classes

```tsx
<button className="btn btn-md btn-primary">Primary</button>
<button className="btn btn-md btn-outline">Outline</button>
```

#### Sizes

| Size   | Class    | Height | Padding | Font Size |
| ------ | -------- | ------ | ------- | --------- |
| Small  | `btn-sm` | 32px   | 12px    | 12px      |
| Medium | `btn-md` | 40px   | 16px    | 14px      |
| Large  | `btn-lg` | 48px   | 24px    | 17px      |

#### Variants

| Variant | Class         | Description                   |
| ------- | ------------- | ----------------------------- |
| Primary | `btn-primary` | Solid CureWay blue background |
| Outline | `btn-outline` | Transparent with border       |

#### Special Types

```tsx
/* Icon-only button */
<button className="btn btn-md btn-primary btn-icon">
  <Icon />
</button>

/* Half-width button */
<button className="btn btn-md btn-primary btn-half">
  Submit
</button>
```

#### States

| State          | Description                     |
| -------------- | ------------------------------- |
| Default        | Base appearance                 |
| Hover          | Slightly darker (auto via CSS)  |
| Pressed/Active | Darkest shade (auto via CSS)    |
| Disabled       | 50% opacity, cursor not-allowed |

**Full Example:**

```tsx
<div className="flex gap-4">
  <button className="btn btn-sm btn-primary">Small</button>
  <button className="btn btn-md btn-primary">Medium</button>
  <button className="btn btn-lg btn-primary">Large</button>
</div>

<div className="flex gap-4">
  <button className="btn btn-md btn-outline">Cancel</button>
  <button className="btn btn-md btn-primary">Submit</button>
</div>

<button className="btn btn-md btn-primary" disabled>
  Disabled
</button>
```

---

## Inputs

Based on Inputs.png, the input system supports sizes and validation states.

### Input Classes

#### Base Usage

```tsx
<input className="input input-md" placeholder="Enter text" />
```

#### Sizes

| Size   | Class      | Height | Padding | Font Size |
| ------ | ---------- | ------ | ------- | --------- |
| Small  | `input-sm` | 36px   | 12px    | 12px      |
| Medium | `input-md` | 44px   | 14px    | 14px      |
| Large  | `input-lg` | 52px   | 16px    | 17px      |

#### States

| State    | Class                | Description                  |
| -------- | -------------------- | ---------------------------- |
| Default  | -                    | Light gray border            |
| Focus    | -                    | Primary border + ring (auto) |
| Success  | `input-success`      | Green border                 |
| Error    | `input-error`        | Red border                   |
| Disabled | `disabled` attribute | 50% opacity                  |

#### With Icons

```tsx
/* Icon left */
<div className="input-with-icon">
  <span className="input-icon-left"><SearchIcon /></span>
  <input className="input input-md" />
</div>

/* Icon right */
<div className="input-with-icon input-with-icon-right">
  <input className="input input-md" />
  <span className="input-icon-right"><CheckIcon /></span>
</div>
```

#### Half Width

```tsx
<input className="input input-md input-half" />
```

**Full Example:**

```tsx
<form className="space-y-4">
  {/* Regular input */}
  <input className="input input-md" placeholder="Email address" />

  {/* Success state */}
  <input className="input input-md input-success" value="valid@email.com" />

  {/* Error state */}
  <input className="input input-md input-error" value="invalid" />

  {/* Disabled */}
  <input className="input input-md" disabled value="Cannot edit" />
</form>
```

---

## Icons

The project uses **lucide-react** for icons (see Icons.png for the full set).

### Icon Sizes

| Size    | Pixels | Usage                  |
| ------- | ------ | ---------------------- |
| Small   | 16px   | Inline with small text |
| Default | 20px   | General use            |
| Large   | 24px   | Headers, buttons       |

### Stroke Width

Default stroke width is `2`. For lighter icons, use `1.5`.

### Usage

```tsx
import { Search, User, ShoppingCart } from "lucide-react";

/* Default size (24px) */
<Search />

/* Custom size */
<Search size={20} />
<User size={16} />

/* With stroke width */
<ShoppingCart size={24} strokeWidth={1.5} />

/* With color using Tailwind */
<Search className="text-primary" size={20} />
<User className="text-muted-foreground" size={16} />
```

### Common Icons by Category

**Navigation:**

- `Home`, `ArrowLeft`, `ArrowRight`, `ChevronDown`, `Menu`, `X`

**Actions:**

- `Plus`, `Minus`, `Edit`, `Trash`, `Search`, `Filter`

**Status:**

- `Check`, `AlertCircle`, `AlertTriangle`, `Info`, `Loader2`

**E-commerce:**

- `ShoppingCart`, `Package`, `CreditCard`, `Truck`

**User:**

- `User`, `Settings`, `LogOut`, `Bell`

---

## Quick Reference

### Most Used Classes

```tsx
/* Colors */
bg-primary text-white           // Primary button
bg-primary-light text-primary   // Subtle primary
text-foreground                 // Main text
text-muted-foreground           // Secondary text
border-border                   // Standard border

/* Typography */
text-title                      // Page titles
text-body                       // Body text
text-caption                    // Small text

/* Spacing */
p-6 gap-6                       // Standard padding/gap (24px)
p-4 gap-4                       // Compact (16px)
p-8 gap-8                       // Spacious (32px)

/* Layout */
container                       // Centered container
container-page                  // Full-page layout
rounded-lg                      // Standard rounding
shadow-card                     // Card shadow

/* Components */
btn btn-md btn-primary          // Primary button
btn btn-md btn-outline          // Outline button
input input-md                  // Standard input
card                           // Card container
```

---

## CSS Variables Reference

All design tokens are available as CSS custom properties in `:root`:

```css
/* Access in CSS */
.custom-element {
  background: hsl(var(--primary));
  color: hsl(var(--foreground));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
```

For TypeScript/JavaScript access to colors, use Tailwind classes or access CSS variables via `getComputedStyle()`.

---

## Migration Notes

If you have existing components using the old color system:

| Old Class             | New Class           |
| --------------------- | ------------------- |
| `bg-primary-subtle`   | `bg-primary-light`  |
| `text-primary-strong` | `text-primary-dark` |
| `bg-primary-inverse`  | `bg-primary-darker` |

The numbered scale (`primary-50` through `primary-900`) provides more granular control and follows standard design system conventions.

---

## Container widths — read this before using `max-w-*`

This project **remaps Tailwind's container scale to breakpoint widths**. The
`max-w-*` utilities therefore do *not* mean what they mean in stock Tailwind:

| Class | Stock Tailwind | **In this project** |
| ----- | -------------- | ------------------- |
| `max-w-sm` | 384px | **640px** |
| `max-w-md` | 448px | **768px** |
| `max-w-lg` | 512px | **1024px** |
| `max-w-xl` | 576px | **1280px** |
| `max-w-2xl` | 672px | **1440px** |

Sizing a dialog `max-w-md` gives a 768px panel, not a 448px one. Five overlays
shipped at roughly twice their intended width because of this.

**Use an explicit value for anything that is not a page container** —
`max-w-[28rem]` rather than `max-w-md`. Keep the named classes for full-width
page containers, which is what the custom scale is for.
