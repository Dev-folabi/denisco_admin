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

- [ ] **Sales Chart** — Bar chart (Chart.js), last 7 days revenue. Olive green bars, rounded corners. — panel renders a placeholder ("Chart will render when API data is available"); wire Chart.js once real revenue data exists (§5)
- [x] **Recent Activity** — 2-column grid: Recent Orders panel + Recent Bookings panel

### 3.3 Products Page (`/products`)
- [x] **Implement Products List Page**

**Panel:** "All Products ({count})" title + "Add Product" primary button
**Table columns:** Image (48px round), Name, Category, Price, Unit, Stock, Status (green pill if in stock / red if out), Actions (Edit + Delete buttons)
**Persistence:** products stored in localStorage (`denisco_admin_products`) until the API is live; Settings → Reset Demo Data clears them

- [x] **Implement Add/Edit Product Modal** — Product Name, Category (select), Unit, Price ₦, Stock Quantity, Product Image (file upload with preview, max 8MB), Description
- [x] **Implement Delete Product** — Confirmation dialog: "Delete Product?" with product name

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
- Demo Data Management: Reset button with confirmation
- Admin Access Info: credentials display

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

- [ ] Login: `POST /api/v1/auth/admin/login`
- [ ] Refresh: `POST /api/v1/auth/refresh`
- [ ] Dashboard: `GET /api/v1/admin/dashboard/overview`
- [ ] Products: `GET/POST/PATCH/DELETE /api/v1/admin/products`
- [ ] Upload sig: `POST /api/v1/admin/products/upload-signature`
- [ ] Inventory: `GET/POST /api/v1/admin/inventory`
- [ ] Orders: `GET/PATCH /api/v1/admin/orders`
- [ ] Customers: `GET /api/v1/admin/customers`
- [ ] Payments: `GET/POST /api/v1/admin/payments`
- [ ] Consult types: `GET/POST/PATCH/DELETE /api/v1/admin/consultations/types`
- [ ] Consult bookings: `GET/PATCH /api/v1/admin/consultations/bookings`
- [ ] Consult slots: `GET/POST/DELETE /api/v1/admin/consultations/slots`
- [ ] Audit logs: `GET /api/v1/admin/audit-logs`

### Auth Flow
*Client-side flow is implemented (login form → auth-provider → API client); untested until the backend is up.*
- [x] Admin enters username + password
- [x] `POST /api/v1/auth/admin/login` returns access JWT (in body) + refresh token (HttpOnly cookie)
- [x] All subsequent requests: `Authorization: Bearer {accessToken}`
- [x] On 401: attempt refresh via cookie, retry
- [x] On refresh failure: redirect to `/login`

---

## 6. Rendering Strategy

All admin pages are **client-side rendered** (CSR):
- [ ] Every page requires authentication — auth state exists (login, role check, JWT storage) but no route guard is wired; pages render in demo mode without a backend (guard deferred until API is live)
- [ ] All data fetched via TanStack Query with admin bearer token — provider installed, no queries yet (tables use demo/localStorage data)
- [ ] Loading states via `useQuery` pending state
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

### Unit Tests
- [ ] Dashboard metric calculations
- [ ] Order status transition validation
- [ ] Consultation type form validation (Zod)
- [ ] Date/time availability logic

### E2E Tests (Playwright)
- [ ] Admin login flow
- [ ] Create, edit, delete product
- [ ] View and update order status
- [ ] Search/filter orders and customers
- [ ] Create consultation type
- [ ] Manage booking availability (add/remove dates and times)
- [ ] Update booking status
- [ ] Responsive: sidebar toggle on mobile
