# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Nuxt development server
npm run build        # Build for production
npm test             # Run Vitest unit tests
npm run coverage     # Generate test coverage report
npm run generate     # Static site generation
npm run preview      # Preview production build
npm run postinstall  # Regenerate Nuxt auto-imports and type declarations
```

Run a single test file:
```bash
npx vitest run tests/models/plan/PlanManager.test.ts
```

## Tech Stack

- **Framework:** Nuxt 3 + Vue 3
- **UI:** NaiveUI + Tailwind CSS
- **State:** Pinia stores + mitt event bus
- **Forms:** Vee-Validate + Yup
- **Charts:** Chart.js via vue-chartjs
- **Testing:** Vitest + @vue/test-utils + happy-dom
- **Backend:** Django REST API (`localhost:8000/api/`) with Supabase

## Architecture

### Manager / Orchestrator Pattern

Business logic lives in `models/`, not in components or stores.

- **`BaseManager`** (`models/common/BaseManager.ts`) — Abstract base for a single financial entity. Each manager tracks configuration, a current state, and state history across time periods. Subclasses implement `process()` and `advanceTimePeriod()`.
- **`BaseOrchestrator`** (`models/common/BaseOrchestrator.ts`) — Coordinates multiple managers, drives the year-by-year simulation loop, and handles inter-manager fund flows.
- **`PlanManager`** (`models/plan/PlanManager.ts`) — The central orchestrator. It instantiates all financial managers (income, expense, debt, brokerage, tax-deferred, IRA, Roth IRA, cash reserve), runs the simulation forward until retirement criteria are met, and tracks tax/contribution limits per year.

Financial managers live in `models/[domain]/` and mirror the same pattern. Each domain also has constants in `constants/`, types in `types/`, and utility functions in `utils/`.

### API Layer

`composables/useApi.ts` is the generic CRUD wrapper used by every domain service composable in `composables/api/`. It handles:
- CSRF token injection
- Cookie-based sessions
- Automatic snake_case ↔ camelCase conversion
- Standard operations: `get`, `list`, `create`, `update`, `patch`, `delete`, plus relationship helpers `addRelated`/`removeRelated`

Domain service composables (`usePlanService`, `useIncomeService`, etc.) call `useApi` with the appropriate endpoint path.

### Routing & Layouts

Nuxt file-based routing under `pages/`. Main layouts:
- `layouts/default.vue` — authenticated app shell (navbar + sidebar)
- `layouts/auth.vue` — login/register pages
- `layouts/landing.vue` — public landing page

`middleware/auth.ts` guards all protected routes.

### Retirement Strategies

Plans support four retirement triggers (defined in `types/Plan.ts`): age-based, debt-free, percent rule (projected income ≥ goal), and target savings. `PlanManager` checks the active strategy each simulated year.

### Component Organization

94 components under `components/` are grouped by domain (`brokerage/`, `debt/`, `income/`, `expense/`, `ira/`, `rothIra/`, `taxDeferred/`, `plan/`) plus `base/` for primitive inputs, `chart/` for visualizations, `common/` for shared UI, and `layout/` for structural chrome.

### Key Type Files

- `types/Plan.ts` — core plan interface and strategy/limit enums
- `types/[Domain]*.ts` — config and state types per financial entity
- `types/Auth.ts`, `types/User.ts` — authentication types
