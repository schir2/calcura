# components/ — Conventions

## Directory structure

```
components/
├── base/           # Primitive input wrappers (BaseInput, BaseSelect, etc.)
├── brokerage/      # Brokerage account components
├── cash_reserve/   # Cash reserve components
├── chart/          # Chart.js visualizations
├── common/         # Shared UI (modals, cards, empty states)
├── debt/           # Debt components
├── expense/        # Expense components
├── hsa/            # HSA components
├── income/         # Income components
├── ira/            # IRA components
├── layout/         # Structural chrome (TheNavbar, TheSidebar)
├── plan/           # Plan components (list, form, summary)
├── roth_ira/       # Roth IRA components (snake_case dir name matches DB)
├── rothIra/        # Roth IRA components (legacy name, migrate to roth_ira/)
├── tax_deferred/   # Tax-deferred (401k) components
└── taxDeferred/    # Tax-deferred (legacy name, migrate to tax_deferred/)
```

## Component rules

### Naming
- Domain component directories should match the DB table name (snake_case plural): `income/`, `expense/`, `debt/`, `brokerage/`, etc.
- Component files use PascalCase: `IncomeForm.vue`, `DebtList.vue`
- One responsibility per component — list, form, card, and detail are separate components

### Data handling
- Components receive data via props — they do not call Supabase directly
- All data fetching goes through composables in `composables/api/`
- Field names in template bindings follow Vue convention (camelCase), but the underlying data properties are snake_case (matching the DB)
- Example: `:growth-rate="income.growth_rate"` — prop is camelCase, data is snake_case

### Forms
- Use Vee-Validate for all form validation
- Schema validators live in `composables/validators/use[Domain]Validator.ts`
- Form field names must match snake_case interface properties exactly

### NaiveUI
- Use NaiveUI components (`n-form`, `n-input`, `n-button`, etc.) — not raw HTML form elements
- Avoid inline styles; use Tailwind classes
- Dialogs, notifications, and message bars use the NaiveUI composables (`useDialog`, `useMessage`, etc.) — these are auto-imported via the Vite plugin

## Adding a new component

1. Place it in the appropriate domain directory
2. Use `defineProps` with typed interfaces — do not use untyped props
3. Emit typed events with `defineEmits`
4. If the component fetches data, it should accept the data as props (passed down from a page or parent) — prefer dumb components
5. If business logic is needed, extract it to a composable or `models/`
