# DENISCO Admin — Design System

**Extracted from:** `denisco_prototype.html` (admin sections)
**Implementation:** Tailwind CSS custom theme + shadcn/ui
**Shares base tokens with:** `denisco_web/design-system.md`

> **MANDATORY:** Always read and follow this file AND `denisco_prototype.html` before implementing any admin UI component or page. All values here are extracted directly from the prototype CSS. Do not guess — use the exact tokens listed.

---

## 1. Color Palette

The admin uses the **same brand color palette** as the customer site, with these key contextual differences:

| Context | Token | Value | Usage |
|---|---|---|---|
| Page background | `cream-deep` | `#F1EAD8` | Admin body background (not cream) |
| Sidebar bg | `forest-deep` | `#0E2213` | Full sidebar background |
| Sidebar text | — | `#c7dcbe` | Default sidebar text |
| Sidebar link | — | `#a9c69d` | Nav link color |
| Sidebar active | — | `rgba(255,255,255,.1)` bg, `#fff` text | Active nav item |
| Sidebar divider | — | `rgba(255,255,255,.14)` | Section separator |
| Panel bg | `white` | `#FFFFFF` | Content panels, cards |
| Stat card border | `olive` | `#5B7B45` | Left accent border on stat cards |

### Complete Palette (same as web)
```
cream:        #FAF6EC
cream-deep:   #F1EAD8   ← admin body background
white:        #FFFFFF
ink:          #1E2A1B
forest:       #173620
forest-deep:  #0E2213   ← admin sidebar
olive:        #5B7B45
olive-light:  #8FAE6E
lime:         #CBE36B
lime-deep:    #A9C93B
clay:         #C97A4A
line:         #E6DFC9
muted:        #847E6C
red:          #B3462C
blue:         #3B6E8F
```

### Status Badge Colors (identical to web)
| Status | Background | Text |
|---|---|---|
| Green (paid, confirmed, in stock) | `#e5f0da` | `#173620` |
| Amber (pending) | `#faecd8` | `#a2651b` |
| Red (failed, cancelled, out of stock) | `#f8e2db` | `#B3462C` |
| Grey (default) | `#efece2` | `#847E6C` |
| Blue (processing, dispatched) | `#e1edf4` | `#3B6E8F` |

### Tailwind v4 Theme (no `tailwind.config.ts`)

Tokens live in `src/app/globals.css` via `@theme inline` (Tailwind v4 CSS-first config):

```css
@theme inline {
  --color-cream: #FAF6EC;
  --color-cream-deep: #F1EAD8;   /* body background */
  --color-ink: #1E2A1B;
  --color-forest: #173620;
  --color-forest-deep: #0E2213;  /* sidebar */
  --color-olive: #5B7B45;
  --color-olive-light: #8FAE6E;
  --color-lime: #CBE36B;
  --color-lime-deep: #A9C93B;
  --color-clay: #C97A4A;
  --color-line: #E6DFC9;
  --color-muted: #847E6C;
  --color-danger: #B3462C;
  --color-info: #3B6E8F;
  --color-badge-green-bg: #e5f0da;   /* …and the other badge-* pairs */
  --font-serif / --font-sans / --font-heading: Fraunces / Manrope / serif
  --radius-lg: 28px; --radius-md: 18px; --radius-sm: 10px;
  --shadow-default: 0 10px 30px rgba(23,54,32,.10);
  --shadow-lg: 0 26px 60px rgba(14,34,19,.18);
}
```

Usage: `bg-forest`, `text-muted`, `border-line`, `font-heading` (serif), `bg-badge-green-bg`, `shadow-[var(--shadow-default)]`. Admin body: `background: cream-deep`, `color: ink`, `font-family: sans`, **base 14.5px / 1.65** (headings serif 600 forest via `@layer base`). There is no `body.admin-mode` class — `body` itself is styled directly.

---

## 2. Typography

### Fonts (same as web)

| Role | Family | Weights |
|---|---|---|
| Serif (headings, stat values, prices) | `Fraunces` | 300, 500, 600, 700, 900, italic 500/600 |
| Sans (body, UI, buttons, labels) | `Manrope` | 400, 500, 600, 700, 800 |

### Admin-Specific Type Scale

| Element | Size | Weight | Family | Color |
|---|---|---|---|---|
| Body base | 14.5px / 1.65 | 400 | Sans | `ink` |
| Page title (topbar h1) | 26px (≤640px → 21px) | 600 | Serif | `forest` |
| Panel title (h3) | 17px | 600 | Serif | `forest` |
| Stat value | 25px (≤640px → 20px) | 700 | Serif | `forest` |
| Stat label | 12px | 400 | Sans | `muted` |
| Table header | 11.5px | 800 | Sans | `forest` |
| Table cell | 13.5px | 400 | Sans | `ink` |
| Sidebar brand | 15px | 700 | Serif | white |
| Sidebar subtitle | — | 400 | Sans | `opacity: .7` |
| Sidebar nav link | 13.5px | 700 | Sans | `#a9c69d` |
| Button text | 14px (sm: 12.5px) | 700 | Sans | — |
| Form label | 13px | 700 | Sans | `forest` |
| Form hint | 12px | 400 | Sans | `muted` |
| Activity item name | 13-14px | 700 | Sans | `ink` |
| Activity item detail | 11.5px | 400 | Sans | `muted` |

---

## 3. Spacing & Layout

### Admin Shell Grid
- Desktop (≥1025px): `grid-template-columns: 260px 1fr` (Tailwind `lg:grid-cols-[260px_1fr]`)
- Sidebar: `padding: 24px 16px` (`py-6 px-4`), full viewport height, sticky on desktop; overlay `fixed`, width `min(88vw, 320px)` below `lg`
- Main: three tiers — `<640px: 16px 12px` (`py-4 px-3`); `≥640px: 24px` (`sm:p-6`); `≥1025px: 32px 36px` (`lg:py-8 lg:px-9`)

### Panel
- Padding: `26px` (≤640px → `16px` / `p-4`)
- Margin-bottom: set per page (`mb-5`/`mb-[34px]` common)
- Border-radius: `18px`, border `1px line`, shadow `--shadow-default`

### Stat Cards Grid
- Dashboard: `grid-cols-3` (6 cards → 2 rows) → 2 cols ≤1024px → 1 col ≤420px
- Gap: `20px` (≤640px → `12px`)

### Content Grid
- 2-column sections: `grid-cols-2; gap: 20px` → 1 col ≤1024px
- Order detail: `1fr 320px; gap: 20px` → 1 col ≤1024px

---

## 4. Border Radius (same as web)

| Token | Value | Usage |
|---|---|---|
| `r-lg` | `28px` | — |
| `r-md` | `18px` | Panels, table wraps, modals |
| `r-sm` | `10px` | Sidebar nav items, form inputs, table images |
| Pill | `9999px` | Buttons, status pills, chips |
| Circle | `50%` | Stat icons, sidebar close, toggle |
| Activity card | `14px` | Activity items, consultation type cards |

---

## 5. Shadows (same as web)

| Token | Value |
|---|---|
| `shadow` | `0 10px 30px rgba(23,54,32,.10)` |
| `shadow-lg` | `0 26px 60px rgba(14,34,19,.18)` |

---

## 6. Button System (same as web)

All buttons: `border-radius: 100px` (pill shape)

| Variant | Background | Text | Hover |
|---|---|---|---|
| Primary | `forest` | white | `olive` bg |
| Ghost | `cream-deep` | `forest` | `olive` bg, white text |
| Danger | `#fbe7e1` | `red` | `red` bg, white text |
| Outline | transparent, `forest` border | `forest` | `forest` bg, white text |

Sizes: Default (`15px 28px`), Small (`9px 18px`, 12.5px font)

---

## 7. Admin-Specific Components

### Admin Sidebar
```
Background:   forest-deep (#0E2213)
Width:        260px desktop (lg, sticky); mobile overlay: min(88vw, 320px), fixed, z-300
Brand:        Logo (50px circle, remote ImageKit) + "DENISCO Admin" serif bold 15px + "MANAGEMENT CONSOLE" small 10.5px
Nav links:    13.5px, 700 weight, #a9c69d, padding 13px 15px, radius 10px, gap 13px, mb 5px
Active:       rgba(255,255,255,.1) bg, white text (also on hover)
Nav order:    Dashboard, Products, Orders, Customers, Transactions, Consultations, Audit Logs
              | divider | Settings, Back to Website, Logout (mt-auto)
Divider:      1px solid rgba(255,255,255,.14), margin 18px 0
Close button: 36px circle, rgba(255,255,255,.08) bg, white text (mobile only, inside brand row)
Scrim:        rgba(14,34,19,.55), fixed inset-0, z-290, click-to-close (mobile only)
Transitions:  translate-x ±full, 250ms ease-out; link click also closes the panel
```

### Admin Topbar
```
Layout:       flex, wrap, space-between, gap 14px, margin-bottom 28px (≤640px → 18px)
Left:         sidebar toggle (40px square, radius 10px, border line, lg:hidden) + h1 (serif 26px; ≤640px → 21px, break-words)
Right:        muted info text (13px), hidden ≤640px
```

### Stat Card
```
Layout:       flex column, gap 8px, padding 24px
Accent:       border-left 4px solid olive
Icon:         42px circle, cream-deep bg, forest icon
Value:        serif 25px, weight 700, forest
Label:        12px, muted
```

### Data Table
```
Wrapper:      overflow-x auto, 1px solid line, radius 18px
Header (th):  cream-deep bg, forest, 11.5px, 800 weight, uppercase, letter-spacing .5px
Cell (td):    padding 14px 18px, 13.5px, line border-bottom
Row hover:    cream bg
Min-width:    640px (scrolls horizontally on mobile)
Empty state:  no table at all — bordered box, centered muted message, py-10 (so the
              message is fully readable on phones; headers would overflow otherwise)
```

### Activity List Item
```
Layout:       grid 42px minmax(0,1fr) auto, align center, gap 11px
Container:    padding 12px, 1px solid line, radius 14px, cream bg
Icon:         38px circle, white bg, olive icon
Hover:        cream-deep bg, forest text
Mobile:       grid 38px minmax(0,1fr), meta wraps below
```

### Panel
```
Background:   white
Border:       1px solid line
Radius:       18px
Padding:      26px (mobile: 17px)
Margin-bottom: 26px (mobile: 16px)
Panel-head:   flex, space-between, margin-bottom 20px
```

### Consultation Type Card (admin list)
```
Layout:       flex, space-between, gap 14px
Container:    padding 16px, 1px solid line, radius 14px, cream bg
Left:         h4 (15px), description, meta (duration + price)
Right:        Edit (ghost) + Delete (danger) buttons
```

### Availability Calendar Day
```
Layout:       flex column, center, min-height 48px
Container:    1px solid line, radius 9px, white bg
Text:         weekday (8px, muted, uppercase), day (13px, bold)
States:
  - Default:    white bg, line border
  - Hover:      olive border (if not past)
  - Available:  #e9f1df bg, olive border, forest text
  - Past:       opacity .35, cursor not-allowed, #f0eee7 bg
  - Selected:   (same as available when checkbox checked)
```

### Availability Chip
```
Layout:       inline-flex, align center, gap 7px
Style:        padding 6px 8px 6px 11px, radius 999px, cream-deep bg
Text:         11.5px, 700 weight, forest
Remove:       transparent bg, red text, 13px icon
```

### Form Controls (all admin forms + modals)
```
Input:        w-full, radius 10px, border 1.5px line, white bg,
              padding 13px 16px, 14px (text-sm), outline none,
              focus: border olive
Label:        13px, 700, forest, margin-bottom 8px, block
Password:     same input + pr-11, eye toggle (16px) absolute right 12px,
              vertical center, muted → forest on hover
Error text:   13px, bold, danger
Banner:       radius 10px, padding 12px 16px, 14px bold —
              red: badge-red-bg/badge-red-text, green: badge-green-bg/badge-green-text
Buttons:      pill (§6); submit = forest, destructive = danger
```

---

## 8. Charts

### Sales Bar Chart (Dashboard)
- Library: Chart.js + react-chartjs-2 (installed)
- **Current state: placeholder.** The dashboard panel renders a cream-deep box with
  "Chart will render when API data is available" — the chart is wired up once real
  revenue data exists (API integration, claude.md §5).
- Planned spec: type bar, olive (#5B7B45), 8px bar radius, last 7 days on X-axis,
  ₦ amounts (`toLocaleString`) on Y, legend hidden, white panel bg.

---

## 9. Modal (native `<dialog>`)

```
Element:      <dialog> with showModal()/close() — Escape closes natively
Overlay:      backdrop rgba(14,34,19,.6) + backdrop-blur 4px
Box:          white, radius 24px, width 92vw, max-width 560px (wide: 720px),
              max-height 90vh, flex column, shadow-lg, 1px line border
Header bar:   flex space-between, padding 20px 28px, border-bottom line,
              title (17px semibold serif-ish) + 36px circle close (X 18)
Body:         padding 28px (p-7), scrollable
Positioning:  centered (m-auto) at every width — NOT a bottom sheet
Confirm dialog: same pattern, max-width 440px, Cancel (outline) +
              confirm (danger: #fbe7e1 bg / red text → red bg / white on hover;
              default: forest bg / white). Optional `loading` → "Processing…"
```

---

## 10. Toast — **not yet implemented**

Spec kept for a future build (no `Toast` component exists today — actions give
feedback inline instead, e.g. the order-detail "Status updated" note):

```
Position:     fixed bottom 26px right 26px, z-index 1200
Style:        white bg, left border 4px, shadow-lg, padding 15px 20px, radius 10px
Text:         13.5px, 700 weight
Max-width:    320px (mobile: full width)
Animation:    0.3s slide-in from right
Auto-dismiss: 3.5s
Types:        success (olive), error (red), info (blue)
```

---

## 11. Icons (Lucide)

Admin-specific icon mappings:

| Purpose | Lucide Icon |
|---|---|
| Dashboard | `Gauge` |
| Products | `Carrot` |
| Orders | `Package` |
| Customers | `Users` |
| Transactions | `Receipt` |
| Consultations | `CalendarCheck` |
| Settings | `Settings` |
| Audit Logs | `History` |
| Back to Website | `ArrowLeft` |
| Logout | `LogOut` |
| Add | `Plus` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Search | `Search` |
| Revenue | `DollarSign` |
| Pending | `Hourglass` |
| Close sidebar | `X` |
| Menu toggle | `Menu` |
| Calendar add | `CalendarPlus` |
| Calendar remove | `CalendarMinus` |
| Clock | `Clock` |
| Info | `Info` |

---

## 12. Differences from Web Design System

| Aspect | Web | Admin |
|---|---|---|
| Body background | `cream` (#FAF6EC) | `cream-deep` (#F1EAD8) |
| Layout | Header + content + footer | Sidebar + main (no header/footer) |
| Navigation | Horizontal nav bar + mobile slide panel | Vertical sidebar + mobile overlay |
| Page structure | Sections with eyebrows, heroes, CTAs | Panels with tables, forms, charts |
| Primary font usage | More serif (editorial feel) | More sans (data-heavy UI) |
| Card style | Shadow cards with hover lift | Flat panels with line borders |
| Tables | Minimal (account area only) | Core UI element throughout |
| Charts | None | Sales bar chart on dashboard |
| Consultation UI | Booking form (customer view) | Management tables + calendar editor |

Despite these layout differences, all **colors, typography families, button styles, form controls, status badges, border radii, shadows, and toast/modal patterns are identical** between the two applications. This ensures a cohesive brand experience.

---

## 13. Currency & Date Formatting (`src/lib/utils/format.ts`)

```typescript
Money(amount: number): string        // Intl en-NG NGN, "₦" prefix — amount in NAIRA
MoneyFromKobo(kobo: number): string  // Money(kobo / 100) — DB stores prices in KOBO
fmtDate(d: string | Date): string    // "04 Oct 2026"
fmtDateTime(d: string | Date): string // "04 Oct 2026, 14:30"
```

**Rule:** any price coming from the API (or product form math) is integer **kobo** —
display it only through `MoneyFromKobo`. The product modal takes naira input and
stores `Math.round(naira * 100)` kobo.

---

## 14. Responsive Breakpoints

Shell uses standard Tailwind min-width variants; content rules use inclusive
max-width variants (see §15):

| Width | Behavior |
|---|---|
| ≥ 1025px (`lg:` up) | Sidebar sticky 260px column + main grid; topbar hamburger hidden; main padding 32/36 |
| ≤ 1024px | Sidebar becomes fixed off-canvas overlay (min(88vw,320px)) + scrim; hamburger visible; 2-col grids → 1 col; dashboard stats → 2 cols |
| ≤ 760px | Customer detail and other `1fr 320px` sidebars → 1 col |
| ≤ 640px | Panel padding → 16px; stat card padding → 16px, icon → 36px, value → 20px; topbar h1 → 21px, info text hidden, margins compact; dashboard stats gap → 12px; main padding → 16/12 |
| ≤ 420px | Dashboard stat cards → 1 column (important — see §15) |

Tables always keep `min-width: 640px` and scroll horizontally inside their wrapper.

---

## 15. In Tailwind — Variant Rules (learned the hard way)

- Use **inclusive** arbitrary media variants: `[@media(max-width:Npx)]:…`.
  Do **not** use `max-sm:` / `max-[Npx]:` — Tailwind v4 compiles them to
  `@media not all and (min-width:Npx)`, which **excludes exactly N** (a 640px or
  390px viewport would miss the rule). Standard `sm:`/`lg:` (min-width) are fine.
- Compiled order of `[@media(max-width:Npx)]:` blocks is **not** width-descending.
  When one element sets the same property at two tiers, the narrower tier must
  carry `!` so it always wins: `[@media(max-width:420px)]:grid-cols-1!`
  (see the dashboard stat grid).
- Unlayered rules in `globals.css` beat all layered utilities regardless of order —
  prefer them for anything the design system owns globally (body, headings).

---

## 16. Component Inventory (actual files)

| Component | File | Notes |
|---|---|---|
| AdminSidebar | `components/layout/admin-sidebar.tsx` | Scrim + aside, nav, logout |
| AdminTopbar | `components/layout/admin-topbar.tsx` | Title + hamburger + info |
| Panel / PanelHead | `components/ui/panel.tsx` | |
| StatCard | `components/ui/stat-card.tsx` | Olive left border |
| DataTable | `components/ui/data-table.tsx` | Empty state = message box (§7) |
| StatusPill | `components/ui/status-pill.tsx` | Variant map for all statuses |
| Modal | `components/ui/modal.tsx` | Native `<dialog>` |
| ConfirmDialog | `components/ui/confirm-dialog.tsx` | Native `<dialog>` |
| Button | `components/ui/button.tsx` | shadcn scaffold — **unused**; pages use inline pill-button classes |
| Toast | — | Not implemented (§10) |

Page-local pieces (not separate files): dashboard activity rows + chart
placeholder, consultation type cards, availability calendar/chips, booking
status selects — all inline in their `(dashboard)` pages.

### Demo data (no backend yet)

API integration is pending (claude.md §5). To keep admin CRUD demonstrable,
**products** and **consultation types** persist to localStorage
(`denisco_admin_products`, `denisco_admin_consult_types`) via
`src/hooks/use-persisted-state.ts`. Settings → "Reset Demo Data" clears both keys.
Tables whose data comes only from the API (orders, customers, transactions,
bookings, audit logs) show empty states until the backend is connected.
