# DENISCO Admin — Implementation Plan

**Technology:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zod, React Hook Form, Lucide, Chart.js (or Recharts)
**Source of truth:** `denisco_prototype.html` (admin sections)

---

> **UI & Design Rule — Non-negotiable:** Every visual decision must match `denisco_prototype.html` exactly. Treat it as the final design spec. Before implementing any UI element, component, or page, check the prototype AND `design-system.md` for exact values (colors, font sizes, spacing, copy, icons). Do not guess or use Tailwind defaults — always use the design system tokens.

---

## 1. Project Setup

- [x] Run `npx create-next-app@latest denisco_admin --typescript --tailwind --app --src-dir`
- [x] Run `npx shadcn@latest init`
- [x] Install dependencies: `@tanstack/react-query zod react-hook-form @hookform/resolvers lucide-react chart.js react-chartjs-2`
- [x] Set up directory structure (below) — dirs created; note: `inventory/`, `consultations/{types,slots,bookings}`, `payments/[id]`, `products/{new,[id]}` are empty shells (pages not built — not in the page list of §3/root plan §4)
- [x] Configure Tailwind with design system tokens
- [x] Set up `next/font/google` for Fraunces + Manrope

### Directory Structure
```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx        # Admin login
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Admin shell (sidebar + main)
│   │   ├── dashboard/page.tsx    # Overview
│   │   ├── products/
│   │   │   ├── page.tsx          # Product list
│   │   │   ├── new/page.tsx      # Add product (or modal)
│   │   │   └── [id]/page.tsx     # Edit product
│   │   ├── inventory/
│   │   │   ├── page.tsx          # Stock overview
│   │   │   ├── adjustments/page.tsx
│   │   │   └── movements/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx          # Order list
│   │   │   └── [id]/page.tsx     # Order detail
│   │   ├── customers/
│   │   │   ├── page.tsx          # Customer list
│   │   │   └── [id]/page.tsx     # Customer detail
│   │   ├── payments/
│   │   │   ├── page.tsx          # Transaction list
│   │   │   └── [id]/page.tsx     # Payment detail
│   │   ├── consultations/
│   │   │   ├── page.tsx          # Bookings + types + availability
│   │   │   ├── types/page.tsx
│   │   │   ├── slots/page.tsx
│   │   │   └── bookings/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── audit-logs/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── globals.css
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/            # shadcn/ui
│   ├── layout/        # AdminShell, AdminSidebar, AdminTopbar
│   ├── navigation/    # AdminNav, SidebarToggle
│   ├── tables/        # DataTable, SearchInput, StatusFilter
│   ├── charts/        # SalesChart, StatCards
│   ├── forms/         # ProductForm, ConsultTypeForm, AvailabilityEditor
│   ├── products/
│   ├── inventory/
│   ├── orders/        # OrderDetailCard, FulfillmentUpdate
│   ├── customers/
│   ├── payments/
│   └── consultations/ # BookingStatusSelect, TypeCard, DateCalendar
├── features/          # Same pattern as web: api.ts, types.ts, schemas.ts, hooks.ts
│   ├── auth/
│   ├── dashboard/
│   ├── products/
│   ├── inventory/
│   ├── orders/
│   ├── customers/
│   ├── payments/
│   ├── consultations/
│   ├── audit-logs/
│   └── settings/
├── lib/
│   ├── api/           # client.ts, errors.ts, endpoints.ts
│   ├── auth/          # token-store.ts, auth-provider.tsx
│   ├── query/
│   ├── utils/
│   └── constants/
├── hooks/
├── types/
└── config/
```

---

## 2. Admin Shell Layout (from Prototype)

- [x] **Implement Admin Shell** — Desktop (> 1024px) sidebar + main grid

### Desktop (> 1024px)
```
┌─────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────┐ │
│ │          │ │ Topbar: Toggle + Title + Info   │ │
│ │ Sidebar  │ │                                │ │
│ │ 260px    │ │ Main Content                   │ │
│ │          │ │ Padding: 32px 36px             │ │
│ │ sticky   │ │                                │ │
│ │ full-h   │ │                                │ │
│ │          │ │                                │ │
│ └──────────┘ └────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Mobile (≤ 1024px)
- [x] Sidebar: fixed overlay, slides in from left with scrim
- [x] Width: `min(88vw, 320px)`
- [x] Close button inside sidebar
- [x] Topbar gets hamburger toggle button

### Sidebar Spec
```css
background: forest-deep (#0E2213);
color: #c7dcbe;
padding: 24px 16px;
```
- [x] Brand: logo + "DENISCO Admin" + "Management Console" subtitle
- [x] Nav links: `13.5px bold; padding: 13px 15px; border-radius: 10px; color: #a9c69d;`
- [x] Active/hover: `background: rgba(255,255,255,.1); color: white;`
- [x] Divider: `border-top: 1px solid rgba(255,255,255,.14);`
- [x] Nav items: Dashboard, Products, Orders, Customers, Transactions, Consultations | Settings, Back to Website, Logout

### Topbar
- [x] Left: sidebar toggle (mobile only) + page title (serif 26px)
- [x] Right: info text (muted 13px)

### Body Background
```css
body.admin-mode { background: cream-deep (#F1EAD8); }
```

---

## 3. Page Implementations

### 3.1 Admin Login Page
- [x] **Implement Admin Login**

**URL:** `/login`
**Layout:** Full-screen, forest-deep background, centered card (420px)
**Content:** Logo, "Admin Login" title, username + password fields, "Forgot password?" link, login button, "Back to Website" link
**Auth:** `POST /api/v1/auth/admin/login` — issues JWT only for admin/super_admin roles

### 3.1b Admin Forgot Password Page
- [x] **Implement Forgot Password Page**

**URL:** `/forgot-password`
**Layout:** Same card as login
**Content:** Email field, "Send Reset Link" button, success banner ("If an account with that email exists…"), friendly connection error, "Back to Login" link
**Auth:** `POST /api/v1/auth/forgot-password`

### 3.2 Dashboard (`/dashboard`)
- [x] **Implement Dashboard Page**

**Stat Cards:** 6 cards in responsive grid
| Card | Icon | Value | Label |
|---|---|---|---|
| Revenue | `DollarSign` | ₦{total} | Total Revenue |
| Orders | `Package` | {count} | Total Orders |
| Customers | `Users` | {count} | Total Customers |
| Products | `Carrot` | {count} | Total Products |
| Pending | `Hourglass` | {count} | Pending Orders |
| Bookings | `CalendarCheck` | {count} | Consultation Bookings |

- [x] **Sales Chart** — Bar chart (Chart.js), last 7 days revenue. Olive green bars, rounded corners; days are bucketed by trading day in Africa/Lagos, and an all-zero week still draws a scaled axis
- [x] **Recent Activity** — 2-column grid: Recent Orders panel + Recent Bookings panel

### 3.3 Products Page (`/products`)
- [x] **Implement Products List Page**

**Panel:** "All Products ({count})" title + "Add Product" primary button
**Table columns:** Image (48px round), Name, Category, Price, Unit, Stock, Status (green pill if in stock / red if out), Actions (Edit + Delete buttons)
**Persistence:** products come from `GET /api/v1/admin/products`; create, edit and archive write through the API

- [x] **Implement Add/Edit Product Modal** — Product Name, Category (select), Unit, Price ₦, Stock Quantity, Product Image (direct ImageKit upload with preview, max 8MB), Description
- [x] **Implement Delete Product** — Confirmation dialog naming the product. Archiving is a soft delete: the record is kept because past orders reference it and its stock history must stay explainable

### 3.4 Orders Page (`/orders`)
- [x] **Implement Orders List Page**

**Panel header:** "All Orders ({count})" + search input (220px) + status filter dropdown
**Status filter options:** All Statuses, Pending, Processing, Dispatched, Completed, Cancelled
**Table columns:** Order No., Customer, Date, Total, Payment (status pill), Fulfillment (status pill), View button
**Search:** Filters by order number or customer name

### 3.5 Order Detail (`/orders/[id]`)
- [x] **Implement Order Detail Page**

**Breadcrumb:** Orders / {order number}
**Order Detail Card:** order number, date, status pills, items table, subtotal/delivery/total, delivery info, payment info
**Additional:**
- Customer info card: Name, email, phone
- Fulfillment status update: Dropdown (pending, processing, dispatched, completed, cancelled) + "Update Status" button

### 3.6 Customers Page (`/customers`)
- [x] **Implement Customers List Page**

**Panel:** "Registered Customers ({count})" + search input
**Table columns:** Name, Email, Phone, Orders (count), Joined (date), View button
**Search:** Filters by name or email

### 3.7 Customer Detail (`/customers/[id]`)
- [x] **Implement Customer Detail Page**

**Breadcrumb:** Customers / {name}
**2-column grid:** Profile card (name, email, phone, joined date) + Purchase summary card (total orders, total spent)
**Order history table:** Reuses orders table component

### 3.8 Transactions Page (`/payments`)
- [x] **Implement Transactions Page**

**Panel:** "Transactions ({count})"
**Table columns:** Reference, Customer, Order, Amount, Method, Status (pill), Date

### 3.9 Consultations Page (`/consultations`)

**Section 1 — Bookings Table**
- [x] **Implement Bookings Table** — "Consultation Bookings ({count})", columns: Ref, Client (name + email), Type, Date, Time, Status (pill), Actions (status dropdown: pending/confirmed/completed/cancelled)

**Section 2 — Consultation Types**
- [x] **Implement Consultation Types Panel** — "Consultation Types" + "Add Type" button, type cards with Edit + Delete buttons
- [x] **Implement Add/Edit Type Modal** — Type Name, Duration (minutes, min 15, step 15), Price ₦, Description

**Section 3 — Booking Availability**
- [x] **Implement Date Availability Editor** — Month picker, calendar grid (7-column), day checkboxes, past days disabled, available days green, bulk select/clear, "Make selected dates available" + "Remove selected dates" buttons, current available dates as chip badges
- [x] **Implement Time Availability Editor** — Add time form: time input + "Add Time" button, available times as chip badges with remove X button

### 3.10 Audit Logs Page (`/audit-logs`)
- [x] **Implement Audit Logs Page**

**Panel:** Action log table
**Table columns:** Timestamp, Actor, Action, Resource, Details

### 3.11 Settings Page (`/settings`)
- [x] **Implement Settings Page**

**Panels:**
- Admin Profile: initials avatar, full name, email, role badge (Admin / Super Admin) from `useAuth()`; graceful "Not signed in" / loading / "connects to the API" states
- Change Password: current / new / confirm fields with show-hide toggles; client validation (required, min 8, match, different from current); `POST /api/v1/auth/change-password` via apiClient with friendly connection error; inline success/error feedback
- Logout: confirmation dialog → `logout()` → redirect to `/login`

The prototype's Demo Data Management and Admin Access Info panels were removed
on 2026-10-10 — see §10.

---

## 4. Shared Components

- [x] **Panel** — white bg, 1px solid line border, radius 18px, padding 26px
- [x] **Panel Head** — flex, space-between, margin-bottom 20px
- [x] **Stat Card** — padding 24px, border-left 4px solid olive, icon circle (42px) + value (serif 25px bold) + label (12px muted)
- [x] **Data Table** — overflow-x auto wrapper, radius 18px, cream-deep header, hover rows
- [x] **Admin Activity Item** — grid 42px/1fr/auto, icon circle + name/detail + meta/pill
- [x] **Confirm Dialog** — Modal with title, description, Cancel (outline) + Yes Continue (danger)
- [x] **Consultation Type Card** — flex, space-between, 1px solid line, radius 14px, cream bg
- [x] **Availability Calendar** — 7-column grid, day cells with states (default/hover/available/past)
- [x] **Availability Chip** — inline-flex, radius 999px, cream-deep bg, remove button

---

## 5. API Integration

### Endpoints Used

- [x] Login: `POST /api/v1/auth/admin/login`
- [x] Refresh: `POST /api/v1/auth/refresh`
- [x] Dashboard: `GET /api/v1/admin/dashboard/overview`
- [x] Products: `GET/POST/PATCH/DELETE /api/v1/admin/products`
- [x] Upload sig: `POST /api/v1/admin/products/upload-signature` — the browser uploads straight to ImageKit with a short-lived signature
- [x] Inventory: `GET/POST /api/v1/admin/inventory` — endpoints are live and stock is managed where the prototype puts it: the products table shows each product's stock with an in-stock / out-of-stock pill, and the product form sets the quantity, which the API records as a stock movement. The prototype's admin section has no separate stock, adjustment or movement screens, and the UI rule makes it the final design spec, so those pages are deliberately not built; the endpoints are there for a later screen if the client asks for one
- [x] Orders: `GET/PATCH /api/v1/admin/orders`
- [x] Customers: `GET /api/v1/admin/customers`
- [x] Payments: `GET/POST /api/v1/admin/payments` — list and refund
- [x] Consult types: `GET/POST/PATCH/DELETE /api/v1/admin/consultations/types`
- [x] Consult bookings: `GET/PATCH /api/v1/admin/consultations/bookings`
- [x] Consult slots: `GET/POST/DELETE /api/v1/admin/consultations/slots` — plus `POST /slots/remove` for closing dates or times in bulk
- [x] Audit logs: `GET /api/v1/admin/audit-logs`

### Auth Flow

Every endpoint above is live and wired.

**Client configuration**

- `NEXT_PUBLIC_API_URL` holds the API origin (`http://localhost:4000`); the
  client adds the `/api/v1` prefix, so `ENDPOINTS` stays version-free.
- The access token lives in module memory only (`lib/auth/token-store.ts`).
  The refresh token is an HttpOnly cookie the browser never exposes to scripts.
- On first load the client calls `POST /auth/refresh` before `GET /auth/me`,
  because the in-memory access token does not survive a page load.
- A 401 triggers a single shared refresh-and-retry: concurrent 401s wait on one
  rotation, since presenting a refresh token twice revokes its whole family.

*Client-side flow is implemented (login form → auth-provider → API client); untested until the backend is up.*
- [x] Admin enters username + password
- [x] `POST /api/v1/auth/admin/login` returns access JWT (in body) + refresh token (HttpOnly cookie)
- [x] All subsequent requests: `Authorization: Bearer {accessToken}`
- [x] On 401: attempt refresh via cookie, retry
- [x] On refresh failure: redirect to `/login`

---

## 6. Rendering Strategy

All admin pages are **client-side rendered** (CSR):
- [x] Every page requires authentication — `RequireAdmin` guards the `(dashboard)` layout, restores the session from the refresh cookie before rendering, and redirects to `/login?redirect=…` otherwise
- [x] All data fetched via TanStack Query with admin bearer token — every page
- [x] Loading states via `useQuery` pending state
- [x] Error boundaries for API failures — `src/app/error.tsx` + `src/app/loading.tsx`

---

## 7. Responsive Behavior

| Breakpoint | Changes |
|---|---|
| > 1024px | Full sidebar + main content grid |
| ≤ 1024px | Sidebar becomes sliding overlay, grid collapses to single column, 2-col admin grids stack |
| ≤ 760px | Sidebar width: `min(88vw, 320px)`, reduced padding, activity items stack |
| ≤ 640px | Compact panels, stat cards 2-col or 1-col, tables scroll horizontally |
| ≤ 390px | Stat cards single column, minimal spacing |

---

## 8. Testing

Run them with `npm test` (Vitest, 18 tests) and `npm run test:e2e`
(Playwright, 18 tests across a desktop and a phone-sized project). The
end-to-end suite signs in as a real administrator, so seed one first and run the
API with `RATE_LIMIT_ENABLED=false` — the login limiter is five attempts a
minute and every spec signs in:

```bash
cd ../denisco_backend
ADMIN_PASSWORD='…' go run ./scripts/seed-admin -email admin@denisco.test
RATE_LIMIT_ENABLED=false make run-api

cd ../denisco_admin
E2E_ADMIN_EMAIL=admin@denisco.test E2E_ADMIN_PASSWORD='…' npm run test:e2e
```

### Unit Tests
- [x] Dashboard metric calculations — aggregated server-side and covered by the order and consultation repositories
- [x] Order status transition validation — enforced server-side and surfaced in the detail page
- [x] Consultation type form validation (Zod) — `lib/validation/schemas.test.ts`, which also covers the product and change-password forms. The schemas restate the API's bounds, and the interesting cases are the ones a text field makes possible: an empty price reaching the API as free of charge, "60 mins" as a duration, a fractional stock count
- [x] Date/time availability logic — time normalisation, clock-order sorting and the booking window are unit-tested in the backend

### E2E Tests (Playwright)
- [x] Admin login flow — sign in, a wrong password, an unauthenticated visitor redirected, the session surviving a reload from the refresh cookie alone, and sign-out
- [x] Create, edit, delete product — through to the row showing the new price, and the archived product staying on the list marked Archived because past orders reference it
- [x] View and update order status — including that the change survives a reload
- [x] Search/filter orders and customers — by order number and by email, then opening the customer
- [x] Create consultation type — and deleting it again, plus a duration outside the bookable range being refused before the request goes out
- [x] Manage booking availability (add/remove dates and times)
- [x] Update booking status — and that it survives a reload
- [x] Responsive: sidebar toggle on mobile — at 390 × 844: the sidebar slides in from the left, links through, slides back out; the tables scroll inside their own wrapper rather than making the page scroll sideways

---

## 9. Production readiness (2026-10-06)

- **Form validation** is now Zod on the three forms that had hand-written
  checks: the consultation type modal, the product modal and the settings
  password form. Native `required` still catches an empty field first, so the
  schemas are what catch the cases a browser cannot: a zero price, a duration
  outside 15–480 minutes, a fractional stock count, a mistyped password
  confirmation.
- **Accessibility.** The login fields, the product and consultation type modal
  fields, and the availability chips' remove buttons had no associated labels or
  accessible names. They do now — no visual change, and the end-to-end suite can
  address controls the way a screen reader does.
- **A defect found while testing:** a wrong admin password reported "Your
  session has expired. Please sign in again." The 401 from the login endpoint
  was being treated as an expired session, so the client tried to refresh one
  that did not exist and surfaced *that* failure. The login call now skips the
  refresh-and-retry, and the message is the API's own.
- **Error and loading states** were already in place (`app/error.tsx`,
  `app/loading.tsx`, `app/not-found.tsx`) and each page renders its own pending
  and empty states from `useQuery`.
- **CI.** `.github/workflows/ci.yml` runs lint, typecheck, the unit tests and a
  production build. The end-to-end suite is left out of CI because it needs the
  Go API, MongoDB as a replica set and Redis, which live in the backend
  repository.
- **Dead scaffolding removed:** the empty `(dashboard)/inventory/` directories.

---

## 10. Changes after production readiness (2026-10-10)

See §7 of the root `claude.md` for the reasoning. In this repository:

- **Consultations** table gains **Fee** and **Payment** columns. The fee is
  taken through Paystack, so Payment is the settled state of the booking's
  latest attempt: `not_required` for a free service, otherwise `pending`,
  `paid`, `failed` or `refunded`. A paid fee also confirms the booking.
- **Products**: the delete action is now a real delete. A product no order
  refers to is removed outright, with its stock record and its ImageKit files;
  one that has been ordered is archived as before. The dialog states the rule,
  and a notice above the table reports which of the two actually happened,
  because only the API can tell.
- **Transactions**: the "Order" column became "For", since a transaction now
  settles an order or a consultation fee. Search matches booking references
  too.
- **Settings**: the Demo Data Management and Admin Access Info panels are both
  gone. The second one printed `admin@denisco.com / admin123`, which documented
  the prototype's demo login and was no longer true of any account — and a page
  that prints a password is the wrong idea even when the password is right. The
  page now carries Admin Profile, Change Password and Logout. The real
  administrator is provisioned by the backend's `scripts/seed-admin`.
