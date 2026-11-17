---
name: SIM-OPS SMA
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#73777f'
  outline-variant: '#c3c6d0'
  surface-tint: '#3f608c'
  primary: '#002549'
  on-primary: '#ffffff'
  primary-container: '#163b65'
  on-primary-container: '#86a6d6'
  inverse-primary: '#a8c8fa'
  secondary: '#0060aa'
  on-secondary: '#ffffff'
  secondary-container: '#66abff'
  on-secondary-container: '#003f72'
  tertiary: '#002a26'
  on-tertiary: '#ffffff'
  tertiary-container: '#00423c'
  on-tertiary-container: '#32b6a8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a8c8fa'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#254872'
  secondary-fixed: '#d3e4ff'
  secondary-fixed-dim: '#a3c9ff'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#004882'
  tertiary-fixed: '#7df6e6'
  tertiary-fixed-dim: '#5edaca'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  gutter-desktop: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system serves high school administrative operators and educators handling intensive academic data, curriculum schedules, national registries (Dapodik), and institutional reporting.

### Aesthetic Foundation
- **Modern Corporate ERP:** Functional, crisp, structured, and focused on information density without clutter.
- **Tone:** Authoritative, dependable, efficient, and precise. It eliminates visual noise while maintaining high usability during extended multi-hour operational sessions.
- **Form Follows Data:** High contrast boundaries, clear visual groupings, and consistent state signaling guide high-volume processing tasks with minimal cognitive load.

## Colors

The palette balances administrative authority with interactive clarity, optimized for extended screen time.

### Role Assignments
- **Primary (`#163B65` - Deep Navy Blue):** Used for global navigation bars, high-level headers, primary key actions, and dominant brand structural anchors.
- **Secondary (`#2878C8` - Tech Blue):** Drives secondary actions, focused element borders, active breadcrumbs, and link states.
- **Tertiary / Accent (`#17A89A` - Vibrant Teal):** Used for highlighting completed operational milestones, live metrics, status badges, and special operational indicators.
- **Neutral Surface & Canvas:** Backgrounds rely on Soft Clean Gray (`#F5F7FA`) with pure white (`#FFFFFF`) cards and structural border lines using `#E2E8F0`. Text utilizes Slate-900 (`#0F172A`) for primary hierarchy and Slate-500 (`#64748B`) for secondary metadata.
- **Semantic Feedback:**
  - Success: Emerald Green (`#16865C`)
  - Warning: Amber Gold (`#D99A22`)
  - Danger / Error: Crimson Red (`#D94B4B`)

## Typography

The type system prioritizes high-legibility tabular scanning and strict hierarchy using `Inter`.

- **Numerical & Tabular Data:** Apply tabular figures (`font-variant-numeric: tabular-nums`) across all data grids, metric cards, and student registration lists (NISN/NPSN) to ensure vertical alignment.
- **Hierarchy:** Reserve Display and Headline sizes exclusively for page banners and section hubs. Body text defaults to `body-md` (14px) for optimized density in enterprise layouts. Labels apply uppercase or semi-bold weights for rapid form recognition.

## Layout & Spacing

A 12-column responsive fluid grid structured around a fixed left-hand navigation sidebar (collapsible from 260px to 72px).

### Layout Rules
- **Desktop (>= 1280px):** 12 columns, 24px (`1.5rem`) gutters, 32px (`2rem`) margins. Content stretches to full container height for data grids.
- **Tablet (768px - 1279px):** 8 columns, 16px (`1rem`) gutters, 24px (`1.5rem`) margins. Sidebar transforms into an off-canvas drawer.
- **Mobile (< 768px):** 4 columns, 12px gutters, 16px margins. Multi-column data reflows into vertical metric cards.
- **Dense Grid Spacing:** Micro-spacings (`space-xs` and `space-sm`) are standard within form inputs and dense data table rows to sustain operational throughput.

## Elevation & Depth

Visual hierarchy is maintained via clean physical surface layering and refined, low-opacity ambient shadows paired with crisp outlines.

### Elevation Levels
- **Level 0 (Flat / Canvas):** Applied to the main page canvas (`#F5F7FA`) and table header backgrounds. No shadow.
- **Level 1 (Card & Content Blocks):** Applied to standard panels, data tables, and forms. Uses a 1px solid border (`#E2E8F0`) and `box-shadow: 0 1px 3px 0 rgba(22, 59, 101, 0.05), 0 1px 2px -1px rgba(22, 59, 101, 0.05)`.
- **Level 2 (Dropdowns & Popovers):** Applied to autocomplete results, filter menus, and action sheets. Uses `box-shadow: 0 4px 6px -1px rgba(22, 59, 101, 0.08), 0 2px 4px -2px rgba(22, 59, 101, 0.06)`.
- **Level 3 (Modals & Confirmation Drawers):** Applied to student record editors and critical alert dialogs. Uses `box-shadow: 0 20px 25px -5px rgba(22, 59, 101, 0.12), 0 8px 10px -6px rgba(22, 59, 101, 0.08)`.

## Shapes

The design uses balanced rounded corners (10px–14px) to soften the density of complex administrative layouts while preserving a neat, structured enterprise layout.

### Corner Radius Tokens
- **Standard (`rounded`, 10px / `0.625rem`):** Buttons, inputs, search bars, chips, and table toolbars.
- **Large (`rounded-lg`, 12px / `0.75rem`):** Administrative cards, panels, dashboard tiles, and modal dialogs.
- **Extra Large (`rounded-xl`, 14px / `0.875rem`):** Primary statistics summary banners and floating contextual sheets.

## Components

### Buttons
- **Primary:** Filled `#163B65` with white text, font weight 600, height 40px (compact 36px in tables), `rounded` (10px). Hover: `#1c497d`. Focus: 2px ring in `#2878C8`.
- **Secondary:** Surface `#FFFFFF`, border 1px solid `#E2E8F0`, text `#163B65`. Hover: `#F5F7FA` with border `#CBD5E1`.
- **Accent Action:** Filled `#17A89A`, text `#FFFFFF`. Used for "Simpan Data", "Sinkronisasi Dapodik", or primary conversion triggers.

### Form Inputs & Selects
- Height 40px, background `#FFFFFF`, border 1px solid `#CBD5E1`, border-radius 10px, padding `0 12px`.
- Text style `body-md`. Focus state uses border `#2878C8` with a 3px outer glow ring of `rgba(40, 120, 200, 0.15)`.
- Error state: 1px border `#D94B4B`, helper text in `label-sm` (`#D94B4B`).

### Data Tables
- Row height: 44px (compact) or 52px (standard).
- Table headers: Surface `#F8FAFC`, uppercase `label-md` text (`#64748B`), bottom border 1px solid `#E2E8F0`.
- Cells: Text `#0F172A`, bottom border 1px solid `#F1F5F9`. Hover state shifts cell background to `#F8FAFC`.
- Sticky first column for student/staff names and sticky right column for record actions.

### Badges & Chips
- Padding: 4px 10px, border-radius: 9999px (pill-style) or 8px.
- Statuses use light-tint surfaces with saturated typography:
  - **Aktif / Lulus:** Background `#E8F6F1`, text `#16865C`.
  - **Tertunda / Proses:** Background `#FEF6E9`, text `#D99A22`.
  - **Keluar / Ditolak:** Background `#FDEEEE`, text `#D94B4B`.

### Checkboxes & Radios
- Size: 18x18px. Border: 1.5px solid `#94A3B8`. Border radius 4px for checkbox, circle for radio. Checked state uses `#163B65` with a crisp white tick mark.