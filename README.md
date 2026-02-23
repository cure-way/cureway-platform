# CureWay

A multi-vendor medicine pharmacy delivery platform built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Folder Structure](#folder-structure)
- [Routing (App Router)](#routing-app-router)
- [Route Map](#route-map)
- [Auth and Roles](#auth-and-roles)
- [Design System and Tailwind Tokens](#design-system-and-tailwind-tokens)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Testing / Linting / Typecheck](#testing--linting--typecheck)
- [Contributing](#contributing)
- [TODO](#todo)

---

## Project Overview

CureWay is a multi-vendor pharmacy delivery web platform that connects patients with pharmacies. The platform supports three user roles:

- **Patient**: Browse medicines, order from pharmacies, upload prescriptions, track orders
- **Pharmacy**: Manage inventory, process orders, handle prescriptions
- **Admin**: Oversee platform operations, manage users, pharmacies, and products

### Key Features

- Public medicine catalog browsing (no auth required)
- Patient registration and authentication
- Prescription upload and verification
- Order management and tracking
- Multi-pharmacy support
- Role-based dashboards (Patient / Pharmacy / Admin)

---

## Tech Stack

| Category         | Technology                             |
| ---------------- | -------------------------------------- |
| Framework        | Next.js 16.1.1 (App Router, Turbopack) |
| Language         | TypeScript 5.x                         |
| UI Library       | React 19.2.3                           |
| Styling          | Tailwind CSS 4.x (design tokens-based) |
| Forms            | React Hook Form 7.x + Zod 4.x          |
| HTTP Client      | Axios 1.x                              |
| Animations       | Framer Motion 12.x                     |
| Icons            | Lucide React, React Icons              |
| Phone Validation | libphonenumber-js                      |
| Package Manager  | pnpm (preferred)                       |
| Linting          | ESLint 9.x                             |

---

## Architecture at a Glance

### Server vs Client Components

- **Server Components** (default): Pages, layouts, data fetching, auth guards
- **Client Components**: Interactive UI (forms, modals, animations) - marked with `"use client"`

### Key Conventions

| Concern             | Location                                       |
| ------------------- | ---------------------------------------------- |
| Routes / Pages      | `src/app/` (App Router)                        |
| Reusable Components | `src/components/{role}/`                       |
| Shared UI           | `src/components/shared/`                       |
| Auth Utilities      | `src/lib/auth/`                                |
| API Client          | `src/lib/api/http.ts`                          |
| Custom Hooks        | `src/hooks/`                                   |
| Services            | `src/services/`                                |
| TypeScript Types    | `src/types/`                                   |
| Design Tokens       | `src/styles/global.css` + `tailwind.config.ts` |

### Data Flow

1. Server components call `requirePatient()` or `getSession()` for auth
2. Server components can directly fetch data or call services
3. Client components use hooks and receive data via props or context
4. API calls go through `src/lib/api/http.ts` (Axios instance with auth interceptors)

---

## Folder Structure

```
cure-way/
├── docs/
│   └── design-system/          # Design system reference images + TOKENS.md
├── public/
│   ├── docs/design-system/     # Design reference PNGs (Color, Typography, etc.)
│   └── icons/                  # Static icons
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth route group (sign-in, sign-up, etc.)
│   │   │   └── auth/           # /auth/* pages
│   │   ├── (patient)/          # Patient-facing routes (main website)
│   │   │   ├── page.tsx        # Home page (/)
│   │   │   ├── categories/     # /categories
│   │   │   ├── medicines/      # /medicines, /medicines/[id]
│   │   │   ├── pharmacies/     # /pharmacies, /pharmacies/[id]
│   │   │   ├── orders/         # /orders (protected)
│   │   │   ├── prescriptions/  # /prescriptions (protected)
│   │   │   ├── notifications/  # /notifications (protected)
│   │   │   └── profile/        # /profile (protected)
│   │   ├── (protected)/        # Protected route group
│   │   │   ├── (admin)/        # Admin portal (/admin/*)
│   │   │   └── (pharmacy)/     # Pharmacy portal (/pharmacy/*)
│   │   ├── (public)/           # Public layout group
│   │   ├── layout.tsx          # Root layout
│   │   ├── error.tsx           # Error boundary
│   │   └── not-found.tsx       # 404 page
│   ├── components/
│   │   ├── admin/              # Admin-specific components
│   │   ├── auth/               # Auth components (forms, layouts)
│   │   ├── patient/            # Patient components (header, etc.)
│   │   ├── pharmacy/           # Pharmacy components
│   │   └── shared/             # Shared UI (Button, Input, etc.)
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom React hooks
│   │   ├── search/             # Search-related hooks
│   │   ├── useClickOutside.ts
│   │   ├── useOTPInput.ts
│   │   └── usePasswordValidation.ts
│   ├── lib/
│   │   ├── auth/               # Auth utilities
│   │   │   ├── get-session.ts  # Session retrieval
│   │   │   └── require-patient.ts  # Auth guard
│   │   ├── api/                # HTTP client + helpers
│   │   │   └── http.ts         # Axios instance with auth interceptors
│   │   ├── constants.ts        # App constants
│   │   ├── roles.ts            # User role definitions
│   │   ├── routes.ts           # Route constants
│   │   └── utils.ts            # Utility functions
│   ├── services/               # API service functions
│   ├── styles/
│   │   ├── global.css          # Tailwind + design tokens
│   │   └── phone-input.css     # Phone input styles
│   ├── types/                  # TypeScript type definitions
│   │   ├── auth.ts             # Auth types + Zod schemas
│   │   └── search.ts           # Search types
│   └── utils/                  # Utility functions
├── tailwind.config.ts          # Tailwind configuration with design tokens
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.mjs           # ESLint configuration
├── postcss.config.mjs          # PostCSS configuration
└── package.json
```

---

## Routing (App Router)

The application uses Next.js App Router with **route groups** to organize different areas:

### Route Groups

| Group                    | Path Prefix   | Purpose                                       |
| ------------------------ | ------------- | --------------------------------------------- |
| `(auth)`                 | `/auth/*`     | Authentication pages (sign-in, sign-up, etc.) |
| `(patient)`              | `/`           | Patient-facing website (public + protected)   |
| `(protected)/(admin)`    | `/admin/*`    | Admin dashboard (protected)                   |
| `(protected)/(pharmacy)` | `/pharmacy/*` | Pharmacy dashboard (protected)                |
| `(public)`               | -             | Public layout wrapper                         |

### Layout Hierarchy

```
Root Layout (src/app/layout.tsx)
├── (auth) Layout → Auth pages with centered card layout
├── (patient) Layout → Patient header + main content
│   ├── Public pages (no auth)
│   └── Protected pages (requirePatient guard)
└── (protected) Layout
    ├── (admin) Layout → Admin sidebar + content
    └── (pharmacy) Layout → Pharmacy sidebar + content
```

---

## Route Map

### Patient Routes (Main Website)

| Route               | Access    | Auth Guard         | Description                |
| ------------------- | --------- | ------------------ | -------------------------- |
| `/`                 | Public    | None               | Home page                  |
| `/categories`       | Public    | None               | Browse medicine categories |
| `/medicines`        | Public    | None               | Browse all medicines       |
| `/medicines/[id]`   | Public    | None               | Medicine details           |
| `/pharmacies`       | Public    | None               | Browse nearby pharmacies   |
| `/pharmacies/[id]`  | Public    | None               | Pharmacy details           |
| `/orders`           | Protected | `requirePatient()` | Patient order history      |
| `/orders/[orderId]` | Protected | `requirePatient()` | Order details              |
| `/prescriptions`    | Protected | `requirePatient()` | Manage prescriptions       |
| `/profile`          | Protected | `requirePatient()` | Patient profile            |
| `/notifications`    | Protected | `requirePatient()` | Notifications              |

### Auth Routes

| Route                                | Access | Description                                  |
| ------------------------------------ | ------ | -------------------------------------------- |
| `/auth`                              | Public | Redirects to `/auth/sign-in`                 |
| `/auth/sign-in`                      | Public | Unified sign in (role detected from backend) |
| `/auth/sign-up`                      | Public | Patient registration                         |
| `/auth/pharmacy/sign-up`             | Public | Pharmacy registration (multi-step)           |
| `/auth/verify-phone`                 | Public | Phone verification                           |
| `/auth/verify-otp`                   | Public | OTP verification                             |
| `/auth/forgot-password`              | Public | Password reset request                       |
| `/auth/forgot-password/verify`       | Public | Reset verification                           |
| `/auth/forgot-password/new-password` | Public | Set new password                             |
| `/auth/registration-submitted`       | Public | Registration success                         |

### Pharmacy Routes

| Route                              | Access               | Description          |
| ---------------------------------- | -------------------- | -------------------- |
| `/pharmacy/home`                   | Protected (Pharmacy) | Pharmacy dashboard   |
| `/pharmacy/orders`                 | Protected (Pharmacy) | Order management     |
| `/pharmacy/orders/[orderId]`       | Protected (Pharmacy) | Order details        |
| `/pharmacy/inventory`              | Protected (Pharmacy) | Inventory management |
| `/pharmacy/inventory/[medicineId]` | Protected (Pharmacy) | Medicine details     |
| `/pharmacy/report`                 | Protected (Pharmacy) | Reports              |
| `/pharmacy/notifications`          | Protected (Pharmacy) | Notifications        |
| `/pharmacy/profile`                | Protected (Pharmacy) | Pharmacy profile     |

### Admin Routes

| Route                         | Access            | Description         |
| ----------------------------- | ----------------- | ------------------- |
| `/admin/dashboard`            | Protected (Admin) | Admin dashboard     |
| `/admin/patients`             | Protected (Admin) | Patient management  |
| `/admin/patients/[patientId]` | Protected (Admin) | Patient details     |
| `/admin/pharmacies`           | Protected (Admin) | Pharmacy management |
| `/admin/products`             | Protected (Admin) | Product management  |
| `/admin/orders`               | Protected (Admin) | Order oversight     |
| `/admin/notifications`        | Protected (Admin) | Notifications       |
| `/admin/settings/profile`     | Protected (Admin) | Profile settings    |
| `/admin/settings/security`    | Protected (Admin) | Security settings   |

---

## Auth and Roles

### Roles

Defined in `src/lib/roles.ts`:

```typescript
export const USER_ROLES = {
  PATIENT: "patient",
  PHARMACY: "pharmacy",
  ADMIN: "admin",
} as const;
```

### Auth Guards

Server-side auth guards in `src/lib/auth/`:

#### `requirePatient()`

Use in server components to require patient authentication:

```tsx
import { requirePatient } from "@/lib/auth";

export default async function OrdersPage() {
  const session = await requirePatient();
  // Redirects to /auth/sign-in if not authenticated
  // Redirects to role-specific portal if wrong role
  return <div>Welcome, {session.user.name}</div>;
}
```

#### `getSession()` / `getPatientSession()`

Get optional session without redirecting:

```tsx
import { getPatientSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getPatientSession();
  // session is null for guests, Session object for authenticated
  return <Header isAuthenticated={session !== null} />;
}
```

### Auth Implementation

Authentication uses a custom JWT-based flow:

- **Access token**: Stored in memory (module-scoped variable in `src/lib/api/http.ts`)
- **Refresh token**: Persisted in `localStorage` (`cureway_rt`)
- **AuthProvider**: Client-side React Context wrapping the app (`src/features/auth/AuthProvider.tsx`)
- **Auto-refresh**: Axios interceptor retries 401 responses with a single in-flight token refresh
- **Login**: `POST /auth/login` returns `{ user, tokens }`, followed by `POST /auth/refresh` to hydrate profile
- **Role-based redirect**: After login the frontend redirects based on `user.role` (PATIENT → `/`, PHARMACY → `/pharmacy/home`, ADMIN → `/admin/dashboard`)

---

## Design System and Tailwind Tokens

The project uses a custom design system defined via:

- **Design Reference**: `public/docs/design-system/*.png`
- **Token Documentation**: [`docs/design-system/TOKENS.md`](docs/design-system/TOKENS.md)
- **CSS Variables**: `src/styles/global.css`
- **Tailwind Config**: `tailwind.config.ts`

### Color Palette

Six semantic color families with 10 shades each:

- **Primary** (CureWay Blue) - Main brand color
- **Secondary** - Complementary actions
- **Error** - Destructive actions, validation
- **Warning** - Cautionary states
- **Success** - Positive feedback
- **Neutral** - Gray scale

### Typography Scale

Based on design spec: Type@36, @30, @25, @21, @17, @14, @12, @10, @8

```tsx
<h1 className="text-t-36-bold">Page Title</h1>
<p className="text-t-14">Body text</p>
```

### Spacing Scale

Pixel values: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80

### Component Classes

Pre-defined component utilities in `global.css`:

- `.btn`, `.btn-primary`, `.btn-outline`, `.btn-sm/md/lg`
- `.input`, `.input-sm/md/lg`, `.input-success`, `.input-error`
- `.card`, `.container-page`

See [TOKENS.md](docs/design-system/TOKENS.md) for complete documentation.

---

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm 9.x (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cure-way

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command      | Description                             |
| ------------ | --------------------------------------- |
| `pnpm dev`   | Start development server with Turbopack |
| `pnpm build` | Build for production                    |
| `pnpm start` | Start production server                 |
| `pnpm lint`  | Run ESLint                              |

---

## Environment Variables

> **Note**: No `.env.example` file exists yet. The following variables are expected based on code analysis:

| Variable                   | Required | Description          | Example                       |
| -------------------------- | -------- | -------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes      | Backend API base URL | `https://api.example.com`     |
| `NEXT_PUBLIC_APP_URL`      | No       | Public app URL       | `https://your-app-domain.com` |

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
SESSION_SECRET=your-random-secret-key-here
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub/GitLab
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### Manual Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

The build output is in `.next/` directory.

---

## Testing / Linting / Typecheck

```bash
# Run ESLint
pnpm lint

# Type checking (via build)
pnpm build
```

> **Note**: No test framework is currently configured. See [TODO](#todo).

---

## Contributing

### Branch Naming

- `feature/<feature-name>` - New features
- `fix/<bug-description>` - Bug fixes
- `refactor/<scope>` - Code refactoring
- `docs/<topic>` - Documentation updates

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add phone verification flow
fix(orders): correct price calculation
docs(readme): update installation steps
```

### Pull Request Guidelines

1. Create feature branch from `main`
2. Make changes with clear commits
3. Ensure `pnpm lint` and `pnpm build` pass
4. Open PR with description of changes
5. Request review from team members

---

## Contact

For questions or support, contact the CureWay development team.
