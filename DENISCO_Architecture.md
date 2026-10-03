# DENISCO GLOBAL AGRICULTURE LTD — Admin Dashboard Architecture

Next.js

TypeScript

TanStack Query

Tailwind CSS

RBAC

This document defines the architecture for the DENISCO GLOBAL AGRICULTURE LTD administration dashboard.

The dashboard will be built using Next.js App Router and TypeScript. It will provide the administrative interface for managing products, inventory, orders, customers, payments and consultation bookings.

The dashboard will follow the functional HTML/CSS/JavaScript prototype in the project root as the primary reference for the approved features, visual design, navigation and workflows. It will replace the prototype's Local Storage demo behaviour with real API integration.

The admin dashboard is an independent application that communicates directly with the Go backend over HTTPS. It does not use a BFF, API proxy or shared generated TypeScript package.

Core architectural decisions

* Framework: Next.js App Router

* Language: TypeScript

* Server state: TanStack Query

* Forms: React Hook Form

* Validation: Zod

* Styling: Tailwind CSS

* UI components: shadcn/ui

* Icons: Lucide

* Tables: TanStack Table

* Charts: Recharts

* API communication: Native `fetch` through a typed API client

* Authentication: Backend-issued JWT with refresh-token rotation

* Authorization: Backend-enforced RBAC

* Deployment: Docker, VPS (Namecheap) 

# 1. Project structure

The admin dashboard will be maintained in its own repository, separate from the customer website, backend and root-level prototype.

```
denisco/
├── denisco_prototype.html
│
├── denisco_backend/
│
├── denisco_web/
│
└── denisco_admin/
    ├── public/
    │   ├── images/
    │   ├── icons/
    │   └── fonts/
    │
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   │   └── login/
    │   │   ├── (dashboard)/
    │   │   │   └── admin/
    │   │   │       ├── page.tsx
    │   │   │       ├── products/
    │   │   │       ├── categories/
    │   │   │       ├── inventory/
    │   │   │       ├── orders/
    │   │   │       ├── customers/
    │   │   │       ├── payments/
    │   │   │       ├── consultations/
    │   │   │       ├── audit-logs/
    │   │   │       └── settings/
    │   │   ├── layout.tsx
    │   │   ├── globals.css
    │   │   ├── error.tsx
    │   │   ├── not-found.tsx
    │   │   └── loading.tsx
    │   │
    │   ├── components/
    │   │   ├── ui/
    │   │   ├── layout/
    │   │   ├── navigation/
    │   │   ├── dashboard/
    │   │   ├── tables/
    │   │   ├── forms/
    │   │   ├── charts/
    │   │   └── feedback/
    │   │
    │   ├── features/
    │   │   ├── auth/
    │   │   ├── dashboard/
    │   │   ├── products/
    │   │   ├── categories/
    │   │   ├── inventory/
    │   │   ├── orders/
    │   │   ├── customers/
    │   │   ├── payments/
    │   │   ├── consultations/
    │   │   └── audit-logs/
    │   │
    │   ├── hooks/
    │   ├── lib/
    │   │   ├── api/
    │   │   ├── auth/
    │   │   ├── query/
    │   │   ├── permissions/
    │   │   ├── utils/
    │   │   └── constants/
    │   │
    │   ├── providers/
    │   ├── types/
    │   └── middleware.ts
    │
    ├── tests/
    ├── .github/
    │   └── workflows/
    ├── .env.example
    ├── .gitignore
    ├── components.json
    ├── next.config.ts
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## 1.1 Directory responsibilities

| Directory               | Responsibility                                                |
| ----------------------- | ------------------------------------------------------------- |
| `app`                   | Dashboard routes, layouts, loading and error boundaries       |
| `components/ui`         | Reusable interface primitives                                 |
| `components/layout`     | Admin sidebar, header, content layout and responsive shell    |
| `components/navigation` | Navigation menus and breadcrumbs                              |
| `components/dashboard`  | Summary cards and dashboard-specific components               |
| `components/tables`     | Reusable data tables, filters and pagination                  |
| `components/forms`      | Shared form components                                        |
| `components/charts`     | Reusable chart components                                     |
| `components/feedback`   | Toasts, alerts, confirmation dialogs and empty states         |
| `features`              | Feature-specific components, API functions, hooks and schemas |
| `hooks`                 | Reusable client-side hooks                                    |
| `lib/api`               | Centralized API client                                        |
| `lib/auth`              | Authentication state and token handling                       |
| `lib/query`             | TanStack Query configuration                                  |
| `lib/permissions`       | Frontend permission utilities for presentation                |
| `lib/utils`             | Formatting and other shared utilities                         |
| `providers`             | Application-level React providers                             |
| `types`                 | Admin-owned TypeScript types                                  |
| `tests`                 | Unit, integration and end-to-end tests                        |

Each feature should own its API functions, types, form schemas and hooks. Shared components should remain generic and reusable.

# 2. Architectural style

The admin dashboard will use a feature-oriented frontend architecture with a clear separation between presentation, feature logic and API communication.

Presentation layer

Pages · Layouts · Tables · Forms · Charts

Feature layer

Products · Inventory · Orders · Customers · Payments · Consultations

Data access layer

Typed API client · TanStack Query · Authentication

Go backend API

REST · HTTPS · `/api/v1/admin`

### Architectural rules

1. Use Server Components by default and Client Components where interactivity is required.

2. Keep business logic out of page components.

3. Centralize backend communication in a typed API client.

4. Use TanStack Query for server state.

5. Use React Hook Form and Zod for complex forms.

6. Use TanStack Table for administrative data tables.

7. Use Recharts for dashboard visualizations when required by the prototype.

8. Enforce permissions on the backend; frontend permission checks only control presentation.

9. Do not duplicate backend business logic.

10. Keep the admin application independent of the customer website.

# 3. Technology stack

| Component     | Technology            | Responsibility                       |
| ------------- | --------------------- | ------------------------------------ |
| Framework     | Next.js App Router    | Routing and application structure    |
| Language      | TypeScript            | Static typing                        |
| Server state  | TanStack Query        | Data fetching, caching and mutations |
| Forms         | React Hook Form       | Form state and submission            |
| Validation    | Zod                   | Client-side validation               |
| Styling       | Tailwind CSS          | Layout and responsive styling        |
| UI components | shadcn/ui             | Accessible reusable UI               |
| Icons         | Lucide                | Consistent iconography               |
| Tables        | TanStack Table        | Sorting, filtering and pagination UI |
| Charts        | Recharts              | Dashboard visualizations             |
| API client    | Native `fetch`        | Backend communication                |
| Notifications | Sonner or equivalent  | User feedback                        |
| Testing       | Vitest and Playwright | Component and browser testing        |
| Deployment    | Docker, VPS (Namecheap) | Hosting                              |

# 4. Prototype-driven implementation

The root `denisco_prototype.html` file is the canonical product and design reference for the dashboard.

The production admin application should reproduce the approved prototype's:

* Dashboard layout and navigation.

* Colours, typography and visual hierarchy.

* Responsive behaviour.

* Summary cards and data visualizations.

* Product and category management interfaces.

* Inventory management workflows.

* Order management interfaces.

* Customer management interfaces.

* Payment and transaction views.

* Consultation booking management.

* Form layouts, tables, filters and dialogs.

* Loading, empty, error and success states.

Implementation rule

The prototype defines the approved administrative experience. Replace its Local Storage demo data with backend data and enforce all production permissions and business rules through the Go API. Any significant difference between the prototype and production workflows should be documented and reconciled.

# 5. Application routes

The initial administration routes are:

| Route                         | Page             | Purpose                                  |
| ----------------------------- | ---------------- | ---------------------------------------- |
| `/login`                      | Admin login      | Administrative authentication            |
| `/admin`                      | Dashboard        | Overview and summary metrics             |
| `/admin/products`             | Products         | Product listing and management           |
| `/admin/products/new`         | Create product   | Add a product                            |
| `/admin/products/[id]`        | Edit product     | Edit an existing product                 |
| `/admin/categories`           | Categories       | Manage product categories                |
| `/admin/inventory`            | Inventory        | Monitor and adjust stock                 |
| `/admin/orders`               | Orders           | List and manage orders                   |
| `/admin/orders/[id]`          | Order details    | View and manage an order                 |
| `/admin/customers`            | Customers        | Search and manage customers              |
| `/admin/customers/[id]`       | Customer details | View customer information                |
| `/admin/payments`             | Payments         | View payment transactions                |
| `/admin/payments/[reference]` | Payment details  | Inspect an individual payment            |
| `/admin/consultations`        | Consultations    | Manage consultation bookings             |
| `/admin/consultations/[id]`   | Booking details  | View and manage a booking                |
| `/admin/audit-logs`           | Audit logs       | Review recorded administrative actions   |
| `/admin/settings`             | Settings         | Manage supported administrative settings |

Only implement settings and audit-log screens to the extent supported by the approved scope and backend capabilities.

# 6. Admin layout and navigation

The application should use a consistent dashboard shell.

DENISCO ADMIN

NAVIGATION

Dashboard

Products

Categories

Inventory

Orders

Customers

Payments

Consultations

DASHBOARD OVERVIEW

Revenue

Orders

Customers

Bookings

Recent activity

Illustrative layout only; the approved prototype determines the actual design.

## 6.1 Layout requirements

The dashboard shell should include:

* Responsive sidebar navigation.

* Header with page title or breadcrumbs.

* User menu and logout.

* Main content region.

* Consistent page spacing.

* Toast notifications.

* Accessible modal and dropdown behaviour.

On mobile, the sidebar should collapse into an accessible navigation drawer or another pattern demonstrated by the prototype.

The navigation should be generated from a central configuration so route labels and icons remain consistent. Permission-based visibility may be applied, but hidden navigation items must never be treated as access control.

# 7. API architecture

The admin dashboard communicates directly with the Go backend using REST over HTTPS.

The administrative API is organized under `/api/v1/admin`, except for authentication endpoints shared with the backend's auth module.

## 7.1 API client

All API requests must go through a centralized, typed API client.

TypeScript

```
// src/lib/api/client.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...init,
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
    },
  );

  const body = await response.json();

  if (!response.ok || body.success === false) {
    throw new ApiError(
      body.message ?? "Request failed",
      response.status,
      body.error?.code,
      body.error?.details,
    );
  }

  return body;
}
```

This is a starting point. The production client should also support token refresh coordination, cancellation, multipart uploads, non-JSON responses and consistent handling of the backend's response envelope.

## 7.2 API endpoint groups

| Endpoint               | Purpose                         |
| ---------------------- | ------------------------------- |
| `/auth/login`          | Admin login                     |
| `/auth/refresh`        | Refresh access token            |
| `/auth/logout`         | Logout and revoke refresh token |
| `/admin/dashboard`     | Dashboard metrics               |
| `/admin/products`      | Product management              |
| `/admin/categories`    | Category management             |
| `/admin/inventory`     | Inventory management            |
| `/admin/orders`        | Order management                |
| `/admin/customers`     | Customer management             |
| `/admin/payments`      | Payment management              |
| `/admin/consultations` | Consultation management         |
| `/admin/audit-logs`    | Administrative audit history    |

The actual endpoint methods and payloads should follow the backend's OpenAPI contract.

## 7.3 Data ownership

The admin dashboard is responsible for displaying and submitting administrative actions. It must not directly modify database records or maintain an independent authoritative copy of business data.

Examples:

* Product creation is performed through the product API.

* Stock adjustments are performed through the inventory API.

* Order transitions are validated by the backend.

* Refund operations are processed through the payment workflow.

* Consultation rescheduling is validated by the consultation module.

Every mutation should display the result returned by the backend and refresh or invalidate affected queries.

# 8. Authentication and authorization

JWT

Role-based access control

The admin dashboard uses the backend's JWT authentication system. It must not implement a separate authentication mechanism from the customer website.

## 8.1 Authentication lifecycle

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_1h8_%22%20width%3D%22656.250244140625%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%221582.9998779296875%22%20viewBox%3D%224%204%20656.250244140625%201582.9998779296875%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_1h8_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(13%2C%2013%2C%2013\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_1h8_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_1h8_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_1h8_%20.error-icon%7Bfill%3Argb\(249%2C%20249%2C%20249\)%3B%7D%23mermaid-_r_1h8_%20.error-text%7Bfill%3Argb\(13%2C%2013%2C%2013\)%3Bstroke%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1h8_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_1h8_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_1h8_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_1h8_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_1h8_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_1h8_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_1h8_%20.marker%7Bfill%3Argb\(93%2C%2093%2C%2093\)%3Bstroke%3Argb\(93%2C%2093%2C%2093\)%3B%7D%23mermaid-_r_1h8_%20.marker.cross%7Bstroke%3Argb\(93%2C%2093%2C%2093\)%3B%7D%23mermaid-_r_1h8_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_1h8_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_1h8_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1h8_%20.cluster-label%20text%7Bfill%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1h8_%20.cluster-label%20span%7Bcolor%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1h8_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_1h8_%20.label%20text%2C%23mermaid-_r_1h8_%20span%7Bfill%3Argb\(13%2C%2013%2C%2013\)%3Bcolor%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1h8_%20.node%20rect%2C%23mermaid-_r_1h8_%20.node%20circle%2C%23mermaid-_r_1h8_%20.node%20ellipse%2C%23mermaid-_r_1h8_%20.node%20polygon%2C%23mermaid-_r_1h8_%20.node%20path%7Bfill%3Argb\(222%2C%20234%2C%20251\)%3Bstroke%3Argb\(83%2C%20154%2C%20248\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_1h8_%20.rough-node%20.label%20text%2C%23mermaid-_r_1h8_%20.node%20.label%20text%2C%23mermaid-_r_1h8_%20.image-shape%20.label%2C%23mermaid-_r_1h8_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_1h8_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_1h8_%20.rough-node%20.label%2C%23mermaid-_r_1h8_%20.node%20.label%2C%23mermaid-_r_1h8_%20.image-shape%20.label%2C%23mermaid-_r_1h8_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_1h8_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_1h8_%20.root%20.anchor%20path%7Bfill%3Argb\(93%2C%2093%2C%2093\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(93%2C%2093%2C%2093\)%3B%7D%23mermaid-_r_1h8_%20.arrowheadPath%7Bfill%3Argb\(93%2C%2093%2C%2093\)%3B%7D%23mermaid-_r_1h8_%20.edgePath%20.path%7Bstroke%3Argb\(93%2C%2093%2C%2093\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_1h8_%20.flowchart-link%7Bstroke%3Argb\(93%2C%2093%2C%2093\)%3Bfill%3Anone%3B%7D%23mermaid-_r_1h8_%20.edgeLabel%7Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_1h8_%20.edgeLabel%20p%7Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3B%7D%23mermaid-_r_1h8_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3Bfill%3Argb\(252%2C%20252%2C%20252\)%3B%7D%23mermaid-_r_1h8_%20.labelBkg%7Bbackground-color%3Argba\(252%2C%20252%2C%20252%2C%200.5\)%3B%7D%23mermaid-_r_1h8_%20.cluster%20rect%7Bfill%3Argb\(249%2C%20249%2C%20249\)%3Bstroke%3Argba\(0%2C%200%2C%200%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_1h8_%20.cluster%20text%7Bfill%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1h8_%20.cluster%20span%7Bcolor%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1h8_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(249%2C%20249%2C%20249\)%3Bborder%3A1px%20solid%20rgba\(0%2C%200%2C%200%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_1h8_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1h8_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_1h8_%20.icon-shape%2C%23mermaid-_r_1h8_%20.image-shape%7Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_1h8_%20.icon-shape%20p%2C%23mermaid-_r_1h8_%20.image-shape%20p%7Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_1h8_%20.icon-shape%20rect%2C%23mermaid-_r_1h8_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3Bfill%3Argb\(252%2C%20252%2C%20252\)%3B%7D%23mermaid-_r_1h8_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_1h8_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_1h8_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%23004f99%3B%7D%23mermaid-_r_1h8_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%23004f99%3B%7D%23mermaid-_r_1h8_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_1h8_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_1h8_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23f5faff%3Bstroke%3Argb\(206%2C%20219%2C%20229\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_1h8_%20.node%20rect%2C%23mermaid-_r_1h8_%20.node%20circle%2C%23mermaid-_r_1h8_%20.node%20ellipse%2C%23mermaid-_r_1h8_%20.node%20polygon%2C%23mermaid-_r_1h8_%20.node%20path%7Bfill%3Argb\(229%2C%20243%2C%20255\)%3Bstroke%3Argba\(0%2C%200%2C%200%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_1h8_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_1h8_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23f5faff%3Bstroke%3Argb\(206%2C%20219%2C%20229\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_1h8_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(206%2C%20219%2C%20229\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_1h8_%20.marker%7Bfill%3Argb\(206%2C%20219%2C%20229\)%3Bstroke%3Argb\(206%2C%20219%2C%20229\)%3B%7D%23mermaid-_r_1h8_%20.node%7Bcolor-scheme%3Alight%3B%7D%23mermaid-_r_1h8_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_1h8__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_1h8__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_1h8__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_1h8__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_1h8__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_1h8__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(419.67474365234375%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-124.6328125%22%20y%3D%22-30%22%20width%3D%22249.265625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EAdmin%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20opens%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20dashboard%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(419.67474365234375%2C%20142\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-112.18359375%22%20y%3D%22-30%22%20width%3D%22224.3671875%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EValid%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20authentication%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(147.72265625%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-135.72265625%22%20y%3D%22-30%22%20width%3D%22271.4453125%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ELoad%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20authorized%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20dashboard%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(457.06927490234375%2C%20308\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-82.27734375%22%20y%3D%22-30%22%20width%3D%22164.5546875%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDisplay%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20login%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-7%22%20transform%3D%22translate\(457.06927490234375%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-104.37109375%22%20y%3D%22-30%22%20width%3D%22208.7421875%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ESubmit%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20credentials%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-F-9%22%20transform%3D%22translate\(457.06927490234375%2C%20512.2999992370605\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-96.04296875%22%20y%3D%22-34.29999923706055%22%20width%3D%22192.0859375%22%20height%3D%2268.5999984741211%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-18.299999237060547\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EBackend%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20verifies%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Ecredentials%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-G-11%22%20transform%3D%22translate\(457.06927490234375%2C%20616.5999984741211\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-100.96875%22%20y%3D%22-30%22%20width%3D%22201.9375%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ELogin%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20successful%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-H-13%22%20transform%3D%22translate\(251.39401245117188%2C%20782.5999984741211\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-82.67135620117188%22%20y%3D%22-30%22%20width%3D%22165.34271240234375%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDisplay%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20error%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-I-15%22%20transform%3D%22translate\(490.72552490234375%2C%20786.8999977111816\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-116.66015625%22%20y%3D%22-34.29999923706055%22%20width%3D%22233.3203125%22%20height%3D%2268.5999984741211%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-18.299999237060547\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EIssue%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20access%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20JWT%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Erefresh%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20token%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-J-17%22%20transform%3D%22translate\(490.72552490234375%2C%20895.4999961853027\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-118.7734375%22%20y%3D%22-34.29999923706055%22%20width%3D%22237.546875%22%20height%3D%2268.5999984741211%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-18.299999237060547\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ELoad%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20admin%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20profile%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Epermissions%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-K-19%22%20transform%3D%22translate\(490.72552490234375%2C%201004.0999946594238\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-103.09765625%22%20y%3D%22-34.29999923706055%22%20width%3D%22206.1953125%22%20height%3D%2268.5999984741211%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-18.299999237060547\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERender%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20authorized%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Edashboard%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-L-21%22%20transform%3D%22translate\(451.52109781901044%2C%201108.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-117.61328125%22%20y%3D%22-30%22%20width%3D%22235.2265625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EAccess%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20token%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20expired%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-M-25%22%20transform%3D%22translate\(293.06276448567706%2C%201540.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-69.0078125%22%20y%3D%22-30%22%20width%3D%22138.015625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EContinue%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-N-27%22%20transform%3D%22translate\(490.72552490234375%2C%201274.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-113.84375%22%20y%3D%22-30%22%20width%3D%22227.6875%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERefresh%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20access%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20token%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-O-29%22%20transform%3D%22translate\(490.72552490234375%2C%201374.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-109.3046875%22%20y%3D%22-30%22%20width%3D%22218.609375%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERefresh%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20successful%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-P-33%22%20transform%3D%22translate\(527.160420735677%2C%201544.699993133545\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-125.08984375%22%20y%3D%22-34.29999923706055%22%20width%3D%22250.1796875%22%20height%3D%2268.5999984741211%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-18.299999237060547\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EClear%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20authentication%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Eredirect%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M419.67474365234375%2C72L419.67474365234375%2C100%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6NDE5LjY3NDc0MzY1MjM0Mzc1LCJ5Ijo3Mn0seyJ4Ijo0MTkuNjc0NzQzNjUyMzQzNzUsInkiOjEwNH1d%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M382.28021240234375%2C172L382.28021240234375%2C185.21704397470535Q382.28021240234375%2C187%20381.19442596471686%2C188.4142135623731L381.19442596471686%2C188.4142135623731Q380.10863952708996%2C189.82842712474618%20378.69442596471686%2C190.91421356237308L378.69442596471686%2C190.9142135623731Q377.28021240234375%2C192%20375.4972563770491%2C192L154.50561227529465%2C192Q152.72265625%2C192%20151.3084426876269%2C193.0857864376269L151.3084426876269%2C193.0857864376269Q149.89422912525382%2C194.17157287525382%20148.8084426876269%2C195.5857864376269L148.8084426876269%2C195.5857864376269Q147.72265625%2C197%20147.72265625%2C198.78295602529465L147.72265625%2C308L147.72265625%2C366%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6MzgyLjI4MDIxMjQwMjM0Mzc1LCJ5IjoxNzJ9LHsieCI6MzgyLjI4MDIxMjQwMjM0Mzc1LCJ5IjoxOTJ9LHsieCI6MTQ3LjcyMjY1NjI1LCJ5IjoxOTJ9LHsieCI6MTQ3LjcyMjY1NjI1LCJ5IjozMDh9LHsieCI6MTQ3LjcyMjY1NjI1LCJ5IjozNzB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M457.06927490234375%2C172L457.06927490234375%2C266%22%20id%3D%22L_B_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_D_0%22%20data-points%3D%22W3sieCI6NDU3LjA2OTI3NDkwMjM0Mzc1LCJ5IjoxNzJ9LHsieCI6NDU3LjA2OTI3NDkwMjM0Mzc1LCJ5IjoyNzB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M457.06927490234375%2C338L457.06927490234375%2C366%22%20id%3D%22L_D_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_E_0%22%20data-points%3D%22W3sieCI6NDU3LjA2OTI3NDkwMjM0Mzc1LCJ5IjozMzh9LHsieCI6NDU3LjA2OTI3NDkwMjM0Mzc1LCJ5IjozNzB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M457.06927490234375%2C438L457.06927490234375%2C466%22%20id%3D%22L_E_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_E_F_0%22%20data-points%3D%22W3sieCI6NDU3LjA2OTI3NDkwMjM0Mzc1LCJ5Ijo0Mzh9LHsieCI6NDU3LjA2OTI3NDkwMjM0Mzc1LCJ5Ijo0NzB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M457.06927490234375%2C546.5999984741211L457.06927490234375%2C574.5999984741211%22%20id%3D%22L_F_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_G_0%22%20data-points%3D%22W3sieCI6NDU3LjA2OTI3NDkwMjM0Mzc1LCJ5Ijo1NDYuNTk5OTk4NDc0MTIxMX0seyJ4Ijo0NTcuMDY5Mjc0OTAyMzQzNzUsInkiOjU3OC41OTk5OTg0NzQxMjExfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M423.41302490234375%2C646.5999984741211L423.41302490234375%2C659.8170424488264Q423.41302490234375%2C661.5999984741211%20422.32723846471686%2C663.0142120364942L422.32723846471686%2C663.0142120364942Q421.24145202708996%2C664.4284255988673%20419.82723846471686%2C665.5142120364942L419.82723846471686%2C665.5142120364942Q418.41302490234375%2C666.5999984741211%20416.6300688770491%2C666.5999984741211L258.1769684764665%2C666.5999984741211Q256.3940124511719%2C666.5999984741211%20254.97979888879877%2C667.685784911748L254.97979888879877%2C667.685784911748Q253.5655853264257%2C668.7715713493749%20252.4797988887988%2C670.185784911748L252.47979888879877%2C670.185784911748Q251.39401245117188%2C671.5999984741211%20251.39401245117188%2C673.3829544994157L251.39401245117188%2C740.5999984741211%22%20id%3D%22L_G_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_H_0%22%20data-points%3D%22W3sieCI6NDIzLjQxMzAyNDkwMjM0Mzc1LCJ5Ijo2NDYuNTk5OTk4NDc0MTIxMX0seyJ4Ijo0MjMuNDEzMDI0OTAyMzQzNzUsInkiOjY2Ni41OTk5OTg0NzQxMjExfSx7IngiOjI1MS4zOTQwMTI0NTExNzE4OCwieSI6NjY2LjU5OTk5ODQ3NDEyMTF9LHsieCI6MjUxLjM5NDAxMjQ1MTE3MTg4LCJ5Ijo3NDQuNTk5OTk4NDc0MTIxMX1d%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M490.72552490234375%2C646.5999984741211L490.72552490234375%2C740.5999984741211%22%20id%3D%22L_G_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_I_0%22%20data-points%3D%22W3sieCI6NDkwLjcyNTUyNDkwMjM0Mzc1LCJ5Ijo2NDYuNTk5OTk4NDc0MTIxMX0seyJ4Ijo0OTAuNzI1NTI0OTAyMzQzNzUsInkiOjc0NC41OTk5OTg0NzQxMjExfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M490.72552490234375%2C821.1999969482422L490.72552490234375%2C849.1999969482422%22%20id%3D%22L_I_J_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_J_0%22%20data-points%3D%22W3sieCI6NDkwLjcyNTUyNDkwMjM0Mzc1LCJ5Ijo4MjEuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo0OTAuNzI1NTI0OTAyMzQzNzUsInkiOjg1My4xOTk5OTY5NDgyNDIyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M490.72552490234375%2C929.7999954223633L490.72552490234375%2C957.7999954223633%22%20id%3D%22L_J_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_J_K_0%22%20data-points%3D%22W3sieCI6NDkwLjcyNTUyNDkwMjM0Mzc1LCJ5Ijo5MjkuNzk5OTk1NDIyMzYzM30seyJ4Ijo0OTAuNzI1NTI0OTAyMzQzNzUsInkiOjk2MS43OTk5OTU0MjIzNjMzfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M147.72265625%2C438L147.72265625%2C512.2999992370605L147.72265625%2C616.5999984741211L147.72265625%2C699.5999984741211L147.72265625%2C786.8999977111816L147.72265625%2C895.4999961853027L147.72265625%2C1004.0999946594238L147.72265625%2C1051.6170378711897Q147.72265625%2C1053.3999938964844%20148.8084426876269%2C1054.8142074588575L148.80844268762692%2C1054.8142074588575Q149.89422912525382%2C1056.2284210212306%20151.3084426876269%2C1057.3142074588575L151.3084426876269%2C1057.3142074588575Q152.72265625%2C1058.3999938964844%20154.50561227529465%2C1058.3999938964844L405.53371471038247%2C1058.3999938964844Q407.3166707356771%2C1058.3999938964844%20408.7308842980502%2C1059.4857803341113L408.7308842980502%2C1059.4857803341113Q410.14509786042333%2C1060.5715667717382%20411.2308842980502%2C1061.9857803341113L411.2308842980502%2C1061.9857803341113Q412.3166707356771%2C1063.3999938964844%20412.3166707356771%2C1065.182949921779L412.3166707356771%2C1068.3999938964844%22%20id%3D%22L_C_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_L_0%22%20data-points%3D%22W3sieCI6MTQ3LjcyMjY1NjI1LCJ5Ijo0Mzh9LHsieCI6MTQ3LjcyMjY1NjI1LCJ5Ijo1MTIuMjk5OTk5MjM3MDYwNX0seyJ4IjoxNDcuNzIyNjU2MjUsInkiOjYxNi41OTk5OTg0NzQxMjExfSx7IngiOjE0Ny43MjI2NTYyNSwieSI6Njk5LjU5OTk5ODQ3NDEyMTF9LHsieCI6MTQ3LjcyMjY1NjI1LCJ5Ijo3ODYuODk5OTk3NzExMTgxNn0seyJ4IjoxNDcuNzIyNjU2MjUsInkiOjg5NS40OTk5OTYxODUzMDI3fSx7IngiOjE0Ny43MjI2NTYyNSwieSI6MTAwNC4wOTk5OTQ2NTk0MjM4fSx7IngiOjE0Ny43MjI2NTYyNSwieSI6MTA1OC4zOTk5OTM4OTY0ODQ0fSx7IngiOjQxMi4zMTY2NzA3MzU2NzcxLCJ5IjoxMDU4LjM5OTk5Mzg5NjQ4NDR9LHsieCI6NDEyLjMxNjY3MDczNTY3NzEsInkiOjEwNzIuMzk5OTkzODk2NDg0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M490.72552490234375%2C1038.3999938964844L490.72552490234375%2C1066.3999938964844%22%20id%3D%22L_K_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_K_L_0%22%20data-points%3D%22W3sieCI6NDkwLjcyNTUyNDkwMjM0Mzc1LCJ5IjoxMDM4LjM5OTk5Mzg5NjQ4NDR9LHsieCI6NDkwLjcyNTUyNDkwMjM0Mzc1LCJ5IjoxMDcwLjM5OTk5Mzg5NjQ4NDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M412.3166707356772%2C1138.3999938964844L412.3166707356771%2C1151.3289260846188Q412.3166707356771%2C1158.3999938964844%20405.24560292381165%2C1158.3999938964844L278.3483246776384%2C1158.3999938964844Q276.56536865234375%2C1158.3999938964844%20275.15115508997064%2C1159.4857803341113L275.15115508997064%2C1159.4857803341113Q273.73694152759754%2C1160.5715667717382%20272.65115508997064%2C1161.9857803341113L272.65115508997064%2C1161.9857803341113Q271.56536865234375%2C1163.3999938964844%20271.56536865234375%2C1165.182949921779L271.56536865234375%2C1191.3999938964844L271.56536865234375%2C1374.3999938964844L271.56536865234375%2C1457.3999938964844L271.56536865234375%2C1489.6473897298176Q271.56536865234375%2C1490.3999938964844%20270.81276448567706%2C1490.3999938964844L270.81276448567706%2C1490.3999938964844Q270.0601603190104%2C1490.3999938964844%20270.0601603190104%2C1491.1525980631511L270.0601603190104%2C1500.3999938964844%22%20id%3D%22L_L_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_M_0%22%20data-points%3D%22W3sieCI6NDEyLjMxNjY3MDczNTY3NzIsInkiOjExMzguMzk5OTkzODk2NDg0NH0seyJ4Ijo0MTIuMzE2NjcwNzM1Njc3MSwieSI6MTE1OC4zOTk5OTM4OTY0ODQ0fSx7IngiOjI3MS41NjUzNjg2NTIzNDM3NSwieSI6MTE1OC4zOTk5OTM4OTY0ODQ0fSx7IngiOjI3MS41NjUzNjg2NTIzNDM3NSwieSI6MTE5MS4zOTk5OTM4OTY0ODQ0fSx7IngiOjI3MS41NjUzNjg2NTIzNDM3NSwieSI6MTM3NC4zOTk5OTM4OTY0ODQ0fSx7IngiOjI3MS41NjUzNjg2NTIzNDM3NSwieSI6MTQ1Ny4zOTk5OTM4OTY0ODQ0fSx7IngiOjI3MS41NjUzNjg2NTIzNDM3NSwieSI6MTQ5MC4zOTk5OTM4OTY0ODQ0fSx7IngiOjI3MC4wNjAxNjAzMTkwMTA0LCJ5IjoxNDkwLjM5OTk5Mzg5NjQ4NDR9LHsieCI6MjcwLjA2MDE2MDMxOTAxMDQsInkiOjE1MDQuMzk5OTkzODk2NDg0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M490.7255249023437%2C1138.3999938964844L490.72552490234375%2C1232.3999938964844%22%20id%3D%22L_L_N_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_N_0%22%20data-points%3D%22W3sieCI6NDkwLjcyNTUyNDkwMjM0MzcsInkiOjExMzguMzk5OTkzODk2NDg0NH0seyJ4Ijo0OTAuNzI1NTI0OTAyMzQzNzUsInkiOjEyMzYuMzk5OTkzODk2NDg0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M490.72552490234375%2C1304.3999938964844L490.72552490234375%2C1332.3999938964844%22%20id%3D%22L_N_O_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_N_O_0%22%20data-points%3D%22W3sieCI6NDkwLjcyNTUyNDkwMjM0Mzc1LCJ5IjoxMzA0LjM5OTk5Mzg5NjQ4NDR9LHsieCI6NDkwLjcyNTUyNDkwMjM0Mzc1LCJ5IjoxMzM2LjM5OTk5Mzg5NjQ4NDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M454.2906290690104%2C1404.3999938964844L454.2906290690104%2C1417.6170378711897Q454.2906290690104%2C1419.3999938964844%20453.2048426313835%2C1420.8142074588575L453.2048426313835%2C1420.8142074588575Q452.1190561937566%2C1422.2284210212306%20450.7048426313835%2C1423.3142074588575L450.7048426313835%2C1423.3142074588575Q449.2906290690104%2C1424.3999938964844%20447.5076730437157%2C1424.3999938964844L322.8483246776384%2C1424.3999938964844Q321.06536865234375%2C1424.3999938964844%20319.65115508997064%2C1425.4857803341113L319.65115508997064%2C1425.4857803341113Q318.23694152759754%2C1426.5715667717382%20317.15115508997064%2C1427.9857803341113L317.15115508997064%2C1427.9857803341113Q316.06536865234375%2C1429.3999938964844%20316.06536865234375%2C1431.182949921779L316.06536865234375%2C1498.3999938964844%22%20id%3D%22L_O_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_M_0%22%20data-points%3D%22W3sieCI6NDU0LjI5MDYyOTA2OTAxMDQsInkiOjE0MDQuMzk5OTkzODk2NDg0NH0seyJ4Ijo0NTQuMjkwNjI5MDY5MDEwNCwieSI6MTQyNC4zOTk5OTM4OTY0ODQ0fSx7IngiOjMxNi4wNjUzNjg2NTIzNDM3NSwieSI6MTQyNC4zOTk5OTM4OTY0ODQ0fSx7IngiOjMxNi4wNjUzNjg2NTIzNDM3NSwieSI6MTUwMi4zOTk5OTM4OTY0ODQ0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M527.160420735677%2C1404.3999938964844L527.160420735677%2C1498.3999938964844%22%20id%3D%22L_O_P_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_P_0%22%20data-points%3D%22W3sieCI6NTI3LjE2MDQyMDczNTY3NywieSI6MTQwNC4zOTk5OTM4OTY0ODQ0fSx7IngiOjUyNy4xNjA0MjA3MzU2NzcsInkiOjE1MDIuMzk5OTkzODk2NDg0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_1h8__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(147.31640625%2C%20225\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(-11.09375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2246.1875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(456.81536865234375%2C%20225\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_D_0%22%20transform%3D%22translate\(-8.74609375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2241.4921875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_E_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_E_F_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_G_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(251.14010620117188%2C%20699.5999984741211\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_H_0%22%20transform%3D%22translate\(-8.74609375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2241.4921875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(490.31927490234375%2C%20699.5999984741211\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_I_0%22%20transform%3D%22translate\(-11.09375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2246.1875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_J_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_J_K_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_K_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(271.31146240234375%2C%201274.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_M_0%22%20transform%3D%22translate\(-8.74609375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2241.4921875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(490.31927490234375%2C%201191.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_N_0%22%20transform%3D%22translate\(-11.09375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2246.1875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_N_O_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(315.65911865234375%2C%201457.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_M_0%22%20transform%3D%22translate\(-11.09375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2246.1875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(526.906514485677%2C%201457.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_P_0%22%20transform%3D%22translate\(-8.74609375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2241.4921875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

The browser should keep access tokens in memory and use secure, HTTP-only cookies for refresh tokens where supported by the backend's deployment configuration.

Coordinate refresh requests centrally so simultaneous failed API requests do not trigger multiple refresh attempts.

## 8.2 Role-based access control

The initial role is `admin`. If the business requires more granular access, introduce additional roles and permissions through the backend.

Suggested permissions:

| Permission             | Description                        |
| ---------------------- | ---------------------------------- |
| `dashboard.read`       | View dashboard metrics             |
| `products.read`        | View products                      |
| `products.write`       | Create and edit products           |
| `categories.manage`    | Manage categories                  |
| `inventory.read`       | View stock                         |
| `inventory.adjust`     | Adjust stock                       |
| `orders.read`          | View orders                        |
| `orders.manage`        | Manage order status                |
| `customers.read`       | View customer information          |
| `customers.manage`     | Perform permitted customer actions |
| `payments.read`        | View payment records               |
| `payments.refund`      | Initiate eligible refunds          |
| `consultations.read`   | View bookings                      |
| `consultations.manage` | Manage consultation bookings       |
| `audit_logs.read`      | View administrative audit records  |
| `settings.manage`      | Change authorized settings         |

These are proposed permission identifiers, not a requirement to implement a complex role-management interface in the initial release.

The frontend may use permissions to hide or disable controls. The backend must independently authorize every protected operation, including direct API requests.

## 8.3 Route protection

All `/admin` routes should require a valid admin identity.

The application should:

1. Check whether the admin is authenticated.

2. Load the current admin profile and permissions.

3. Redirect unauthenticated users to `/login`.

4. Deny access to unauthorized pages or actions.

5. Preserve the intended destination when redirecting to login, where safe.

Client-side route protection is for user experience only. The backend remains the authorization boundary.

# 9. Feature architecture

## 9.1 Dashboard overview

The dashboard should provide a consolidated view of operational activity.

Potential metrics include:

* Total orders.

* Orders awaiting processing.

* Revenue over a selected period.

* Payment transaction counts.

* Customer counts.

* Pending consultation bookings.

* Low-stock products.

* Recent orders.

* Recent administrative activity, if supported.

The precise metrics, cards and visualizations must follow the approved prototype.

### Dashboard data

Use a dedicated backend dashboard endpoint for aggregated data rather than downloading every order, customer and payment record to calculate the dashboard in the browser.

Example response:

JSON

```
{
  "success": true,
  "message": "Dashboard retrieved successfully.",
  "data": {
    "orders": {
      "total": 120,
      "pending": 8
    },
    "revenue": {
      "amount": 1500000,
      "currency": "NGN"
    },
    "customers": {
      "total": 350
    },
    "consultations": {
      "pending": 6
    }
  }
}
```

The values are illustrative. The production response should reflect the agreed reporting definitions and time period.

Revenue metrics must distinguish confirmed payments from pending, failed and refunded transactions. The dashboard must not treat order totals as collected revenue.

## 9.2 Product management

The product management interface should support:

* Listing products.

* Searching and filtering.

* Creating products.

* Editing product information.

* Managing product images.

* Managing category assignments.

* Publishing, unpublishing or archiving products.

* Viewing product availability.

Product forms should use React Hook Form and Zod.

Product images should be uploaded through ImageKit using the backend's approved upload-signing flow. The frontend must not contain ImageKit private credentials.

Before saving, validate required fields, image metadata and supported product status values. The backend must perform the final validation.

## 9.3 Category management

The category interface should support:

* Category listing.

* Category creation.

* Category editing.

* Category activation and deactivation.

* Product association visibility, where required.

Category deletion must account for existing product references. If a category is in use, the backend should reject unsafe deletion or apply an explicitly defined archival workflow.

## 9.4 Inventory management

The inventory interface should display:

* Product name and identifier.

* Quantity on hand.

* Reserved quantity.

* Available quantity.

* Low-stock status, where configured.

* Recent inventory movements.

Authorized administrators should be able to submit stock adjustments with an appropriate reason.

Every adjustment must be submitted to the backend and recorded as an inventory movement. The frontend must not directly update the displayed stock as though the adjustment were committed until the backend confirms success.

Concurrent inventory changes should be reconciled using the latest server response.

## 9.5 Order management

The order management interface should support:

* Order listing.

* Search and filtering.

* Status filtering.

* Order detail views.

* Customer and delivery information.

* Payment status visibility.

* Item and total breakdown.

* Eligible status transitions.

* Cancellation workflows where supported.

Order status options should be derived from the backend's permitted transitions or a documented equivalent. Avoid allowing administrators to select arbitrary statuses.

For irreversible or financially significant actions, such as cancellations or refund requests, display a confirmation dialog and the relevant order information before submission.

## 9.6 Customer management

The customer management interface should support:

* Customer listing.

* Search by permitted identifiers.

* Customer profile details.

* Order history.

* Payment history where authorized.

* Consultation booking history.

* Account status visibility.

Only display personal information needed for the administrative task. Sensitive information should be protected by backend permissions and omitted from unnecessary screens.

Any account suspension, deletion or other sensitive action should require explicit confirmation and be recorded in the audit log.

## 9.7 Payment management

The payment interface should support:

* Transaction listing.

* Search by payment reference or order.

* Filtering by payment status.

* Payment detail views.

* Provider reference visibility.

* Order association.

* Refund status visibility.

* Authorized refund initiation, if included in the approved scope.

Payment status must come from the backend. The admin interface must not allow manual editing of a payment to mark it as successful.

Refunds should use the backend's Paystack integration and follow the defined authorization and reconciliation workflow.

## 9.8 Consultation management

The consultation interface should support:

* Booking listing.

* Date and status filtering.

* Booking detail views.

* Customer details.

* Consultation type and selected slot.

* Confirmation and cancellation.

* Rescheduling, if supported by the approved workflow.

Any rescheduling operation must be validated by the backend to ensure that the new slot remains available.

Changes should trigger the relevant customer notifications asynchronously through the backend.

## 9.9 Audit logs

Where included in the approved scope, the dashboard should provide read-only access to administrative audit records.

Useful fields include:

* Administrator identifier.

* Action performed.

* Affected resource.

* Timestamp.

* Request or correlation ID.

* Relevant before-and-after values, where appropriate.

Audit logs must be generated by the backend. The frontend must not fabricate audit events based on user interactions.

# 10. Data fetching and state management

Use TanStack Query for server state and React's built-in state mechanisms for temporary UI state.

## 10.1 State ownership

| State                     | Recommended owner                             |
| ------------------------- | --------------------------------------------- |
| Dashboard metrics         | TanStack Query                                |
| Product listings          | TanStack Query                                |
| Product details           | TanStack Query                                |
| Categories                | TanStack Query                                |
| Inventory                 | TanStack Query                                |
| Orders                    | TanStack Query                                |
| Customers                 | TanStack Query                                |
| Payments                  | TanStack Query                                |
| Consultation bookings     | TanStack Query                                |
| Audit logs                | TanStack Query                                |
| Table sorting and filters | URL search parameters or TanStack Table state |
| Pagination                | URL search parameters                         |
| Form values               | React Hook Form                               |
| Dialog visibility         | React state                                   |
| Sidebar visibility        | React state                                   |
| Authentication            | Auth provider, synchronized with backend      |
| Temporary selections      | React state                                   |

Avoid maintaining duplicate copies of server data in React Context or unrelated component state.

## 10.2 Query configuration

TypeScript

```
// src/lib/query/query-client.ts

import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: true,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
```

Adjust the stale time according to the feature. For example, dashboard summaries can use a short stale time, while payment and inventory details should be refreshed after relevant mutations.

## 10.3 Query keys

Use consistent query keys for cache invalidation.

TypeScript

```
export const queryKeys = {
  dashboard: {
    overview: (params: object) =>
      ["dashboard", "overview", params] as const,
  },

  products: {
    all: ["products"] as const,
    list: (params: object) =>
      ["products", "list", params] as const,
    detail: (id: string) =>
      ["products", "detail", id] as const,
  },

  inventory: {
    all: ["inventory"] as const,
    list: (params: object) =>
      ["inventory", "list", params] as const,
  },

  orders: {
    all: ["orders"] as const,
    list: (params: object) =>
      ["orders", "list", params] as const,
    detail: (id: string) =>
      ["orders", "detail", id] as const,
  },

  customers: {
    list: (params: object) =>
      ["customers", "list", params] as const,
    detail: (id: string) =>
      ["customers", "detail", id] as const,
  },

  payments: {
    list: (params: object) =>
      ["payments", "list", params] as const,
    detail: (reference: string) =>
      ["payments", "detail", reference] as const,
  },

  consultations: {
    list: (params: object) =>
      ["consultations", "list", params] as const,
    detail: (id: string) =>
      ["consultations", "detail", id] as const,
  },
};
```

After a successful mutation, invalidate the affected queries. For example, a successful stock adjustment should refresh inventory and any product views that display availability.

# 11. Data tables and filtering

Use TanStack Table for administrative data grids.

Tables should support the interactions required by the prototype, such as:

* Pagination.

* Sorting.

* Search.

* Column visibility, if required.

* Status filtering.

* Row selection, if required.

* Action menus.

* Responsive presentation.

For large collections, use backend pagination and filtering rather than downloading every record to the browser.

Prefer URL search parameters for filters and pagination that administrators may want to bookmark or share. Use stable identifiers in row actions and avoid depending on array positions.

Every table should have loading, empty and error states. Avoid displaying an empty table when the actual problem is a failed API request.

# 12. Forms and mutations

Use React Hook Form and Zod for product forms, inventory adjustments, customer actions, consultation management and other complex administrative workflows.

Example product schema:

TypeScript

```
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(1),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  status: z.enum([
    "draft",
    "published",
    "archived",
  ]),
});

export type ProductFormValues =
  z.infer<typeof productSchema>;
```

The schema is illustrative and must be aligned with the backend's actual field definitions.

### Mutation requirements

* Disable duplicate submissions while a mutation is pending.

* Display useful validation errors.

* Show a success message after the backend confirms the operation.

* Invalidate affected queries.

* Use confirmation dialogs for consequential actions.

* Prevent accidental repeated submissions.

* Avoid optimistic updates for irreversible financial or inventory operations.

The backend remains responsible for validating business rules and enforcing valid state transitions.

# 13. Charts and reporting

Use Recharts for dashboard visualizations when the approved prototype requires charts.

Possible visualizations include:

* Revenue over time.

* Order volume by status.

* Sales by product.

* Consultation booking trends.

* Inventory distribution.

Charts must be based on backend-provided data or a documented reporting endpoint. Avoid calculating business-critical financial metrics solely from the currently displayed rows.

For every chart:

* Display the relevant reporting period.

* Include understandable labels and units.

* Handle empty and incomplete datasets.

* Provide a loading state.

* Include an accessible textual summary where appropriate.

* Avoid presenting pending payments as confirmed revenue.

If the prototype only requires summary cards and tables, do not add charts without a clear product requirement.

# 14. Error handling and feedback

| Scenario                 | Expected behaviour                             |
| ------------------------ | ---------------------------------------------- |
| Initial loading          | Skeleton or loading indicator                  |
| Empty collection         | Helpful empty state                            |
| Network failure          | Error state and retry option                   |
| Expired authentication   | Attempt refresh, then redirect if unsuccessful |
| Insufficient permissions | Access-denied message                          |
| Validation failure       | Inline field errors                            |
| Duplicate submission     | Prevent or safely handle                       |
| Product update failure   | Preserve entered form values                   |
| Inventory conflict       | Display latest available stock                 |
| Invalid order transition | Explain the rejected action                    |
| Payment provider error   | Show the backend's verified status             |
| Booking conflict         | Refresh booking information                    |
| Unexpected error         | Error boundary and recoverable message         |

Use consistent toast notifications for short-lived feedback. Important results, such as payment or order status changes, should remain visible on their detail pages.

Implement route-level `loading.tsx`, `error.tsx` and `not-found.tsx` where appropriate.

# 15. Security architecture

| Area             | Requirement                                            |
| ---------------- | ------------------------------------------------------ |
| Authentication   | Backend-issued JWT                                     |
| Authorization    | Backend-enforced RBAC                                  |
| Route protection | Authentication checks and access-aware navigation      |
| Transport        | HTTPS                                                  |
| Token storage    | Access token in memory; secure refresh cookie          |
| CSRF             | Protect cookie-authenticated state-changing operations |
| CORS             | Exact approved admin origin                            |
| Input validation | Zod and independent backend validation                 |
| Payments         | No direct status manipulation                          |
| Inventory        | All adjustments through authorized API                 |
| Secrets          | Server-side only                                       |
| Audit            | Backend-generated administrative records               |
| Dependencies     | Regular updates and vulnerability checks               |

The admin frontend must not expose backend secrets or trust client-provided role information. A modified browser request must not grant an administrator access to an operation that the backend would otherwise deny.

Use confirmation dialogs and clear action descriptions for refunds, account changes, stock adjustments and other consequential operations.

# 16. Environment configuration

Example `.env.example`:

dotenv

```
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

Use the actual production API and dashboard URLs in deployment.

Do not put backend secrets, MongoDB credentials, Redis credentials, JWT signing secrets, Paystack secret keys or ImageKit private keys in the admin frontend environment.

Only expose public values through `NEXT_PUBLIC_` variables.

# 17. Testing strategy

Use unit, component, integration and end-to-end tests.

| Test type         | Tool                              | Scope                                             |
| ----------------- | --------------------------------- | ------------------------------------------------- |
| Unit              | Vitest                            | Formatting, permission presentation and utilities |
| Component         | Vitest and React Testing Library  | Forms, tables and dialogs                         |
| API integration   | Vitest                            | API client and query behaviour                    |
| End-to-end        | Playwright                        | Complete admin workflows                          |
| Accessibility     | Playwright and axe integration    | Keyboard and accessibility                        |
| Visual regression | Playwright screenshots, if needed | Prototype design parity                           |

## 17.1 Essential test scenarios

Authentication and permissions

* Successful admin login.

* Invalid login.

* Expired access token.

* Refresh-token rotation.

* Logout and session expiry.

* Unauthenticated access to protected pages.

* Hiding unauthorized actions.

* Handling backend permission-denied responses.

Products and inventory

* Product creation and editing.

* Invalid product forms.

* Image upload failure.

* Product publication.

* Inventory adjustment.

* Concurrent stock changes.

* Failed inventory updates.

Orders and payments

* Order listing and filtering.

* Order detail rendering.

* Valid and invalid status transitions.

* Payment history.

* Payment detail views.

* Refund confirmation and failure handling.

Customers and consultations

* Customer search.

* Customer detail views.

* Authorized account actions.

* Consultation filtering.

* Booking status changes.

* Slot conflicts.

* Booking cancellation and rescheduling.

Dashboard

* Metrics loading.

* Empty reporting periods.

* Failed dashboard requests.

* Correct formatting of monetary values.

* Consistent reporting filters.

Responsive behaviour

* Collapsible sidebar.

* Mobile tables or alternative layouts.

* Responsive forms and dialogs.

* Keyboard navigation.

* No unintended horizontal overflow.

End-to-end tests should verify the complete administrative workflows, not just whether individual pages render.

# 18. Deployment architecture

The admin dashboard is independently deployable from the customer website and backend.

| Option | Deployment                | Considerations                                               |
| ------ | ------------------------- | ------------------------------------------------------------ |
 Docker | Next.js standalone on VPS | Shares VPS resources with the other services                 |

For a 2 GB RAM VPS, hosting the admin dashboard on a managed platform can reduce memory pressure. If Docker is selected, use standalone output, resource limits and production monitoring.

The dashboard should communicate directly with the Go API over HTTPS. Configure CORS to permit the exact production admin origin.

For production, use a separate admin subdomain if that matches the agreed domain structure, and apply suitable security headers and access controls.

# 19. CI/CD workflow

Use GitHub Actions to automate validation and deployment.

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_1hq_%22%20width%3D%22540.4921875%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%221108%22%20viewBox%3D%224%204%20540.4921875%201108%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_1hq_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(13%2C%2013%2C%2013\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_1hq_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_1hq_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_1hq_%20.error-icon%7Bfill%3Argb\(249%2C%20249%2C%20249\)%3B%7D%23mermaid-_r_1hq_%20.error-text%7Bfill%3Argb\(13%2C%2013%2C%2013\)%3Bstroke%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1hq_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_1hq_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_1hq_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_1hq_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_1hq_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_1hq_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_1hq_%20.marker%7Bfill%3Argb\(93%2C%2093%2C%2093\)%3Bstroke%3Argb\(93%2C%2093%2C%2093\)%3B%7D%23mermaid-_r_1hq_%20.marker.cross%7Bstroke%3Argb\(93%2C%2093%2C%2093\)%3B%7D%23mermaid-_r_1hq_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_1hq_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_1hq_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1hq_%20.cluster-label%20text%7Bfill%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1hq_%20.cluster-label%20span%7Bcolor%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1hq_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_1hq_%20.label%20text%2C%23mermaid-_r_1hq_%20span%7Bfill%3Argb\(13%2C%2013%2C%2013\)%3Bcolor%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1hq_%20.node%20rect%2C%23mermaid-_r_1hq_%20.node%20circle%2C%23mermaid-_r_1hq_%20.node%20ellipse%2C%23mermaid-_r_1hq_%20.node%20polygon%2C%23mermaid-_r_1hq_%20.node%20path%7Bfill%3Argb\(222%2C%20234%2C%20251\)%3Bstroke%3Argb\(83%2C%20154%2C%20248\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_1hq_%20.rough-node%20.label%20text%2C%23mermaid-_r_1hq_%20.node%20.label%20text%2C%23mermaid-_r_1hq_%20.image-shape%20.label%2C%23mermaid-_r_1hq_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_1hq_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_1hq_%20.rough-node%20.label%2C%23mermaid-_r_1hq_%20.node%20.label%2C%23mermaid-_r_1hq_%20.image-shape%20.label%2C%23mermaid-_r_1hq_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_1hq_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_1hq_%20.root%20.anchor%20path%7Bfill%3Argb\(93%2C%2093%2C%2093\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(93%2C%2093%2C%2093\)%3B%7D%23mermaid-_r_1hq_%20.arrowheadPath%7Bfill%3Argb\(93%2C%2093%2C%2093\)%3B%7D%23mermaid-_r_1hq_%20.edgePath%20.path%7Bstroke%3Argb\(93%2C%2093%2C%2093\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_1hq_%20.flowchart-link%7Bstroke%3Argb\(93%2C%2093%2C%2093\)%3Bfill%3Anone%3B%7D%23mermaid-_r_1hq_%20.edgeLabel%7Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_1hq_%20.edgeLabel%20p%7Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3B%7D%23mermaid-_r_1hq_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3Bfill%3Argb\(252%2C%20252%2C%20252\)%3B%7D%23mermaid-_r_1hq_%20.labelBkg%7Bbackground-color%3Argba\(252%2C%20252%2C%20252%2C%200.5\)%3B%7D%23mermaid-_r_1hq_%20.cluster%20rect%7Bfill%3Argb\(249%2C%20249%2C%20249\)%3Bstroke%3Argba\(0%2C%200%2C%200%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_1hq_%20.cluster%20text%7Bfill%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1hq_%20.cluster%20span%7Bcolor%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1hq_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(249%2C%20249%2C%20249\)%3Bborder%3A1px%20solid%20rgba\(0%2C%200%2C%200%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_1hq_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(13%2C%2013%2C%2013\)%3B%7D%23mermaid-_r_1hq_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_1hq_%20.icon-shape%2C%23mermaid-_r_1hq_%20.image-shape%7Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_1hq_%20.icon-shape%20p%2C%23mermaid-_r_1hq_%20.image-shape%20p%7Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_1hq_%20.icon-shape%20rect%2C%23mermaid-_r_1hq_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(252%2C%20252%2C%20252\)%3Bfill%3Argb\(252%2C%20252%2C%20252\)%3B%7D%23mermaid-_r_1hq_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_1hq_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_1hq_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%23004f99%3B%7D%23mermaid-_r_1hq_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%23004f99%3B%7D%23mermaid-_r_1hq_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_1hq_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_1hq_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23f5faff%3Bstroke%3Argb\(206%2C%20219%2C%20229\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_1hq_%20.node%20rect%2C%23mermaid-_r_1hq_%20.node%20circle%2C%23mermaid-_r_1hq_%20.node%20ellipse%2C%23mermaid-_r_1hq_%20.node%20polygon%2C%23mermaid-_r_1hq_%20.node%20path%7Bfill%3Argb\(229%2C%20243%2C%20255\)%3Bstroke%3Argba\(0%2C%200%2C%200%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_1hq_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_1hq_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23f5faff%3Bstroke%3Argb\(206%2C%20219%2C%20229\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_1hq_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(206%2C%20219%2C%20229\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_1hq_%20.marker%7Bfill%3Argb\(206%2C%20219%2C%20229\)%3Bstroke%3Argb\(206%2C%20219%2C%20229\)%3B%7D%23mermaid-_r_1hq_%20.node%7Bcolor-scheme%3Alight%3B%7D%23mermaid-_r_1hq_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_1hq__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_1hq__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_1hq__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_1hq__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_1hq__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_1hq__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(343.4114583333333%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-108.51953125%22%20y%3D%22-30%22%20width%3D%22217.0390625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPush%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20pull%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20request%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(343.4114583333333%2C%20142\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-111.03515625%22%20y%3D%22-30%22%20width%3D%22222.0703125%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EInstall%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20dependencies%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(343.4114583333333%2C%20242\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-103.58203125%22%20y%3D%22-30%22%20width%3D%22207.1640625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETypeScript%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20checks%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(343.4114583333333%2C%20342\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-59.26171875%22%20y%3D%22-30%22%20width%3D%22118.5234375%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EESLint%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-7%22%20transform%3D%22translate\(343.4114583333333%2C%20442\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-129.9453125%22%20y%3D%22-30%22%20width%3D%22259.890625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EUnit%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20and%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20component%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20tests%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-F-9%22%20transform%3D%22translate\(343.4114583333333%2C%20542\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-95.8671875%22%20y%3D%22-30%22%20width%3D%22191.734375%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EProduction%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20build%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-G-11%22%20transform%3D%22translate\(343.4114583333333%2C%20642\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-96.0078125%22%20y%3D%22-30%22%20width%3D%22192.015625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EAll%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20checks%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20pass%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-H-13%22%20transform%3D%22translate\(122.25%2C%20808\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-110.25%22%20y%3D%22-30%22%20width%3D%22220.5%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EReport%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failed%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20checks%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-I-15%22%20transform%3D%22translate\(375.4140625%2C%20808\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-102.9140625%22%20y%3D%22-30%22%20width%3D%22205.828125%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EApproved%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20branch%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-J-17%22%20transform%3D%22translate\(148%2C%20974\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-94.9453125%22%20y%3D%22-30%22%20width%3D%22189.890625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPublish%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20CI%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20result%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-K-19%22%20transform%3D%22translate\(409.71875%2C%20974\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-126.7734375%22%20y%3D%22-30%22%20width%3D%22253.546875%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDeploy%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20admin%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20dashboard%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-L-21%22%20transform%3D%22translate\(409.71875%2C%201074\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-81.0546875%22%20y%3D%22-30%22%20width%3D%22162.109375%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-9.5\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ESmoke%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20tests%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M343.4114583333333%2C72L343.4114583333333%2C100%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6MzQzLjQxMTQ1ODMzMzMzMzMsInkiOjcyfSx7IngiOjM0My40MTE0NTgzMzMzMzMzLCJ5IjoxMDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M343.4114583333333%2C172L343.4114583333333%2C200%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6MzQzLjQxMTQ1ODMzMzMzMzMsInkiOjE3Mn0seyJ4IjozNDMuNDExNDU4MzMzMzMzMywieSI6MjA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M343.4114583333333%2C272L343.4114583333333%2C300%22%20id%3D%22L_C_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_D_0%22%20data-points%3D%22W3sieCI6MzQzLjQxMTQ1ODMzMzMzMzMsInkiOjI3Mn0seyJ4IjozNDMuNDExNDU4MzMzMzMzMywieSI6MzA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M343.4114583333333%2C372L343.4114583333333%2C400%22%20id%3D%22L_D_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_E_0%22%20data-points%3D%22W3sieCI6MzQzLjQxMTQ1ODMzMzMzMzMsInkiOjM3Mn0seyJ4IjozNDMuNDExNDU4MzMzMzMzMywieSI6NDA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M343.4114583333333%2C472L343.4114583333333%2C500%22%20id%3D%22L_E_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_E_F_0%22%20data-points%3D%22W3sieCI6MzQzLjQxMTQ1ODMzMzMzMzMsInkiOjQ3Mn0seyJ4IjozNDMuNDExNDU4MzMzMzMzMywieSI6NTA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M343.4114583333333%2C572L343.4114583333333%2C600%22%20id%3D%22L_F_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_G_0%22%20data-points%3D%22W3sieCI6MzQzLjQxMTQ1ODMzMzMzMzMsInkiOjU3Mn0seyJ4IjozNDMuNDExNDU4MzMzMzMzMywieSI6NjA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M311.40885416666663%2C672L311.40885416666663%2C685.2170439747053Q311.40885416666663%2C687%20310.32306772903974%2C688.4142135623731L310.32306772903974%2C688.4142135623731Q309.23728129141284%2C689.8284271247462%20307.82306772903974%2C690.9142135623731L307.82306772903974%2C690.9142135623731Q306.40885416666663%2C692%20304.625898141372%2C692L129.03295602529465%2C692Q127.25%2C692%20125.83578643762691%2C693.0857864376269L125.83578643762691%2C693.0857864376269Q124.42157287525382%2C694.1715728752538%20123.33578643762692%2C695.5857864376269L123.33578643762691%2C695.5857864376269Q122.25%2C697%20122.25%2C698.7829560252947L122.25%2C766%22%20id%3D%22L_G_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_H_0%22%20data-points%3D%22W3sieCI6MzExLjQwODg1NDE2NjY2NjYzLCJ5Ijo2NzJ9LHsieCI6MzExLjQwODg1NDE2NjY2NjYzLCJ5Ijo2OTJ9LHsieCI6MTIyLjI1LCJ5Ijo2OTJ9LHsieCI6MTIyLjI1LCJ5Ijo3NzB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M375.4140625%2C672L375.4140625%2C766%22%20id%3D%22L_G_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_I_0%22%20data-points%3D%22W3sieCI6Mzc1LjQxNDA2MjUsInkiOjY3Mn0seyJ4IjozNzUuNDE0MDYyNSwieSI6NzcwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M341.109375%2C838L341.109375%2C851.2170439747053Q341.109375%2C853%20340.0235885623731%2C854.4142135623731L340.0235885623731%2C854.4142135623731Q338.9378021247462%2C855.8284271247462%20337.5235885623731%2C856.9142135623731L337.5235885623731%2C856.9142135623731Q336.109375%2C858%20334.32641897470535%2C858L154.78295602529465%2C858Q153%2C858%20151.5857864376269%2C859.0857864376269L151.5857864376269%2C859.0857864376269Q150.17157287525382%2C860.1715728752538%20149.08578643762692%2C861.5857864376269L149.0857864376269%2C861.5857864376269Q148%2C863%20148%2C864.7829560252947L148%2C932%22%20id%3D%22L_I_J_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_J_0%22%20data-points%3D%22W3sieCI6MzQxLjEwOTM3NSwieSI6ODM4fSx7IngiOjM0MS4xMDkzNzUsInkiOjg1OH0seyJ4IjoxNDgsInkiOjg1OH0seyJ4IjoxNDgsInkiOjkzNn1d%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M409.71875%2C838L409.71875%2C932%22%20id%3D%22L_I_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_K_0%22%20data-points%3D%22W3sieCI6NDA5LjcxODc1LCJ5Ijo4Mzh9LHsieCI6NDA5LjcxODc1LCJ5Ijo5MzZ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M409.71875%2C1004L409.71875%2C1032%22%20id%3D%22L_K_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_K_L_0%22%20data-points%3D%22W3sieCI6NDA5LjcxODc1LCJ5IjoxMDA0fSx7IngiOjQwOS43MTg3NSwieSI6MTAzNn1d%22%20marker-end%3D%22url\(%23mermaid-_r_1hq__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_D_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_E_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_E_F_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_G_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(121.99609375%2C%20725\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_H_0%22%20transform%3D%22translate\(-8.74609375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2241.4921875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(375.0078125%2C%20725\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_I_0%22%20transform%3D%22translate\(-11.09375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2246.1875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(147.74609375%2C%20891\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_J_0%22%20transform%3D%22translate\(-8.74609375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2241.4921875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(409.3125%2C%20891\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_K_0%22%20transform%3D%22translate\(-11.09375%2C-8\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5%22%20width%3D%2246.1875%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_K_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

Recommended CI steps:

1. Install dependencies from the committed lockfile.

2. Run TypeScript checks.

3. Run ESLint.

4. Run unit and component tests.

5. Build the production application.

6. Run selected end-to-end tests.

7. Deploy approved changes.

8. Verify authentication and key administrative pages after deployment.

Use separate preview and production environment configurations. Production deployment credentials must be stored securely in GitHub Actions or the selected hosting platform.

# 20. Implementation phases

Phase 1

Project foundation

* Initialize Next.js and TypeScript.

* Configure Tailwind CSS and shadcn/ui.

* Extract design tokens from the prototype.

* Set up dashboard layouts and route groups.

* Configure TanStack Query and the API client.

* Establish authentication and permission utilities.

* Set up linting, testing and CI.

Phase 2

Dashboard and navigation

* Implement the admin shell.

* Build sidebar and header navigation.

* Implement dashboard summary cards.

* Integrate reporting endpoints.

* Add loading, empty and error states.

Phase 3

Products, categories and inventory

* Implement product listing and forms.

* Integrate ImageKit uploads.

* Build category management.

* Implement inventory tables and adjustments.

* Add filtering, pagination and confirmation dialogs.

Phase 4

Orders and payments

* Build order listing and detail pages.

* Implement permitted order transitions.

* Build payment and transaction views.

* Implement eligible refund workflows.

* Add status filters and relevant confirmations.

Phase 5

Customers and consultations

* Implement customer listing and details.

* Add authorized customer actions.

* Build consultation booking management.

* Implement cancellation and rescheduling where supported.

* Integrate backend audit visibility where required.

Phase 6

Quality assurance and deployment

* Compare the dashboard against the prototype.

* Complete responsive and accessibility testing.

* Verify authorization and sensitive workflows.

* Run end-to-end administrative tests.

* Optimize performance.

* Deploy and perform production smoke tests.

# 21. Architectural decisions and constraints

| Decision          | Chosen approach              | Reason                                      |
| ----------------- | ---------------------------- | ------------------------------------------- |
| Framework         | Next.js App Router           | Routing and application structure           |
| Language          | TypeScript                   | Maintainability                             |
| Architecture      | Feature-oriented             | Clear separation of administrative features |
| Server state      | TanStack Query               | API caching and mutation management         |
| Tables            | TanStack Table               | Flexible data-grid functionality            |
| Charts            | Recharts                     | Dashboard visualization                     |
| Forms             | React Hook Form and Zod      | Form handling and validation                |
| Styling           | Tailwind CSS                 | Consistent responsive styling               |
| UI components     | shadcn/ui                    | Reusable accessible components              |
| Authentication    | JWT access and refresh flow  | Shared backend authentication               |
| Authorization     | Backend-enforced RBAC        | Secure administrative operations            |
| API communication | Direct REST calls            | No unnecessary BFF                          |
| API types         | Admin-owned TypeScript types | Independent repository                      |
| Rendering         | Server Components by default | Reduced client-side JavaScript              |
| Testing           | Vitest and Playwright        | Component and workflow coverage             |
| Deployment        | Docker, VPS (Namecheap)    | Independent deployment                      |

## Final architecture principle

The admin dashboard is an administrative interface, not a separate business-logic system. It must follow the approved prototype, obtain authoritative data from the Go backend and submit all administrative operations through authorized API endpoints.

The frontend controls presentation and interaction. The backend controls permissions, data integrity, inventory, order transitions, payments and consultation booking rules.
