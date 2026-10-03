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

### Tailwind Config
```typescript
// tailwind.config.ts — identical to web config
const config = {
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FAF6EC', deep: '#F1EAD8' },
        ink: '#1E2A1B',
        forest: { DEFAULT: '#173620', deep: '#0E2213' },
        olive: { DEFAULT: '#5B7B45', light: '#8FAE6E' },
        lime: { DEFAULT: '#CBE36B', deep: '#A9C93B' },
        clay: '#C97A4A',
        line: '#E6DFC9',
        muted: '#847E6C',
        danger: '#B3462C',
        info: '#3B6E8F',
        badge: {
          green: { bg: '#e5f0da', text: '#173620' },
          amber: { bg: '#faecd8', text: '#a2651b' },
          red: { bg: '#f8e2db', text: '#B3462C' },
          grey: { bg: '#efece2', text: '#847E6C' },
          blue: { bg: '#e1edf4', text: '#3B6E8F' },
        }
      },
    },
  },
};
```

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
| Page title (topbar h1) | 26px (mobile: 21-24px) | 600 | Serif | `forest` |
| Panel title (h3) | 17px | 600 | Serif | `forest` |
| Stat value | 25px (mobile: 20px) | 700 | Serif | `forest` |
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
- Desktop: `grid-template-columns: 260px 1fr`
- Sidebar: `padding: 24px 16px`, full viewport height, sticky
- Main: `padding: 32px 36px` (mobile: `16px 12px`)

### Panel
- Padding: `26px` (mobile: `17px`)
- Margin-bottom: `26px` (mobile: `16px`)
- Border-radius: `18px`

### Stat Cards Grid
- Desktop: `repeat(4, 1fr)` or `repeat(6, 1fr)` for dashboard
- Tablet: `repeat(2, 1fr)`
- Mobile: `repeat(2, minmax(0, 1fr))` or `1fr` on very small screens
- Gap: `20px` (mobile: `12px`)

### Content Grid
- 2-column sections: `grid-template-columns: 1fr 1fr; gap: 28px`
- Collapses to `1fr` on tablet/mobile

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
Width:        260px (mobile overlay: min(88vw, 320px))
Brand:        Logo (50px circle) + "DENISCO Admin" serif bold + "Management Console" small
Nav links:    13.5px, 700 weight, #a9c69d, padding 13px 15px, radius 10px
Active:       rgba(255,255,255,.1) bg, white text
Divider:      1px solid rgba(255,255,255,.14), margin 18px 0
Close button: 36px circle, rgba(255,255,255,.08) bg, white text (mobile only)
Scrim:        rgba(14,34,19,.55), covers full viewport
```

### Admin Topbar
```
Layout:       flex, space-between, margin-bottom 28px
Left:         sidebar toggle (icon-btn, mobile only) + h1 (serif 26px)
Right:        muted info text (13px)
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

---

## 8. Charts

### Sales Bar Chart (Dashboard)
- Library: Chart.js (or Recharts)
- Type: bar
- Color: olive (#5B7B45)
- Border radius: 8px per bar
- X-axis: Last 7 days (weekday labels)
- Y-axis: Revenue in ₦ (formatted with toLocaleString)
- Legend: hidden
- Background: white (inside panel)

---

## 9. Modal (same as web)
```
Overlay:      fixed inset 0, rgba(14,34,19,.6), z-index 1000
Box:          white, radius 24px, max-width 560px (wide: 820px), max-height 90vh, padding 30px
Close:        absolute top 18px right 18px, 36px circle, cream-deep bg
Mobile:       align flex-end, max-height 94dvh, radius 20px 20px 14px 14px
```

---

## 10. Toast (same as web)
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

## 13. Currency & Date Formatting (same as web)

```typescript
// Currency
function Money(amount: number): string {
  return '₦' + Number(amount || 0).toLocaleString('en-NG');
}

// Date
function fmtDate(d: string | number): string {
  return new Date(d).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
}

// DateTime
function fmtDateTime(d: string | number): string {
  return new Date(d).toLocaleString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
```
