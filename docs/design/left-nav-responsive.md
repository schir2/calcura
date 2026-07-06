# Responsive Left Navigation — Behavior Spec

Status: accepted · Issues: #111 (this spec), #112 (implementation), #113 (UX correctness)

## Problem

The authenticated app shell renders a persistent `n-layout-sider`
(`app/components/layout/TheLeftSidebar.vue`, 240px, collapsible to a 64px icon
rail) with no breakpoint logic. On phones it permanently eats horizontal space
and there is no off-canvas/hamburger affordance. This note fixes the target
behavior so the implementation slices (#112, #113) build to an agreed spec.

## Breakpoints (three tiers)

Keyed to the standard Tailwind screens already in use (`md` = 768px, `lg` =
1024px). Detect reactively with VueUse (`useBreakpoints`/`useMediaQuery`, already
installed and registered in `nuxt.config.ts`).

| Tier | Range | Sidebar | Navbar |
|------|-------|---------|--------|
| Desktop | ≥ `lg` (1024px) | Full 240px sider; **keep** the collapse-to-64px-rail trigger (`show-trigger`) — unchanged from today | As today |
| Tablet | `md`–`lg` (768–1023px) | Sider defaults to the **collapsed 64px icon rail** (no drawer) | As today |
| Mobile | < `md` (768px) | **No persistent sider.** Off-canvas `n-drawer` (left placement) holding the same menu; content is full-width | Hamburger added (see below) |

## Navbar per tier

- **≥ `md`:** unchanged — logo/wordmark left; Dashboard button, user dropdown
  (avatar), theme switcher right.
- **< `md` (mobile):**
  - Add a **hamburger** button in the **left slot, to the left of the Calcura
    logo** (prototype variant A). Visible only below `md`. Opens the drawer.
  - **Drop the Dashboard button** from the right-side controls — it is redundant
    with the Dashboard entry in the drawer menu. Keep the user dropdown (avatar)
    and theme switcher.

## Single-source menu

Both the persistent sider and the mobile drawer render the **same**
`menuOptions`, built in `TheLeftSidebar.vue` from `app/constants/tools.ts` (plus
the hardcoded Dashboard entry). Do not duplicate the menu definition — extract it
to a shared source if needed so both modes consume one list.

## Drawer UX (see #113)

- Tapping a nav link navigates and closes the drawer.
- Tapping the backdrop/overlay closes the drawer.
- Background page scroll is locked while open, restored on close.
- Resizing up to ≥ `md` dismisses the drawer and restores the persistent sider —
  no stuck/overlapping state.
- Esc closes (NaiveUI `n-drawer` default); focus behavior follows the default.

## Notes

- Frontend-only; no schema/API impact.
- Styling uses `skin` tokens + NaiveUI per the design system.
- Decided via a throwaway prototype (`app/pages/prototype/mobile-nav.vue`,
  variants A/B) — variant A won; prototype deleted after capture.
