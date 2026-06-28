# Context

## Glossary

### Form Defaults (`*defaults`)
Typed objects (e.g. `taxDeferredDefaults: TaxDeferredInsert`) that pre-fill a create form when no template is selected. Typed against Supabase `*Insert` types so the compiler catches schema drift. Live in `constants/` — not in `types/`.

### Templates
User-selectable starting points stored in Supabase (`*_template` tables). When a template is selected, `processTemplate()` merges its values over the form defaults — template wins, defaults fill gaps. Templates are above defaults in the hierarchy: Template → Default → nothing.

### Create Form
A form component typed against the domain's Supabase `*Insert` type. Emits `create: [insert: *Insert]`. Has no `id`. Corresponds to `CreateForm.vue` per domain.

### Edit Form
A form component that receives a full entity (with `id`) as a prop. Emits `update: [id: number, update: *Update]`. The `id` comes from `props.entity.id`, never from form model state. Corresponds to `EditForm.vue` per domain.

### `useCrudForm`
Composable that manages form state and validation only. Returns `{ formRef, modelRef, rules, validate }`. Does not own emit logic — that lives in the form component. Generic over whatever Supabase type the caller passes (`*Insert` for create, full entity for edit).

## Glossary — Design System

### Design token
A named, reusable styling value (a color, radius, or elevation) defined once and referenced everywhere. In this app, tokens are CSS custom properties in `app/assets/css/tailwind.css` — the single source of truth. See [ADR 008](docs/adr/008-design-tokens-tailwind-source-of-truth.md) and [docs/design-system.md](docs/design-system.md).

### Skin token
The public Tailwind API over the color tokens: `bg-skin-*`, `text-skin-*`, `border-skin-*`, `ring-skin-*`, `fill-skin-*`. Each resolves to a CSS var via the `withOpacity()` helper. Components use skin tokens, never raw Tailwind colors (`text-red-500`, `text-white`).

### Semantic color role
A token named for its *meaning*, not its hue: `primary`, `secondary`, `error`, `success`, `warning`, `info`, `base`, `muted`, `surface`. Styling references the role so recoloring the brand is one var edit.

### Brand palette
The concrete color values currently assigned to the semantic roles. Lives entirely in `tailwind.css`. Initially seeded from NaiveUI's default theme, then evolved independently. NaiveUI is pointed *at* the palette (downstream), not the source of it.

## Naming Conventions

### Runtime variable names must be fully descriptive
Callback parameters, locals, and all runtime identifiers use complete, meaningful names — never 1-2 letter abbreviations. `taxDeferred`, `brokerage`, `manager`, `command` — not `td`, `b`, `m`, `c`. This applies everywhere: `map`, `reduce`, `forEach`, and plain variable declarations.

Generic type parameters (`T`, `TState`, `TConfig`, `TRow`) are exempt — they follow standard TypeScript convention and operate only in the type system.

## Glossary — Simulation

### Command
A pointer to a domain entity that can participate in the simulation: `model_name` (e.g. `'tax_deferred'`) + `model_id`. A command is plan-scoped and shared across all sequences on that plan.

### Command Sequence
A named, ordered list of commands associated with a plan. A plan always has at least one sequence (auto-created by trigger on plan INSERT). Multiple sequences let the user compare different activation/ordering strategies.

### Command Sequence Command (CSC)
The junction record linking a Command to a Sequence. Carries `order` (integer, 1-based) and `is_active` (boolean). These are per-sequence — the same command can be active in one sequence and inactive in another.

### Active Command
A CSC where `is_active = true`. The simulation processes **only** active commands. Inactive commands are skipped entirely — the corresponding manager does not run at all that year. There is no "passive processing" mode.

### `ordering_type`
A **live sort directive** on a Command Sequence that determines how active commands are ordered for execution — `predefined` or `custom`.

- `predefined` — commands are sorted on the fly by the canonical model-priority algorithm (income → debt → expense → cash_reserve → tax_deferred → roth_ira → ira → brokerage → hsa). `csc.order` is **ignored** in this mode; switching to predefined does not rewrite it.
- `custom` — commands are sorted by the user's drag order stored in `csc.order`.

The simulation branches on `ordering_type`: under `predefined` it applies the priority algorithm; under `custom` it sorts by `csc.order`. So `csc.order` is authoritative only when `ordering_type = 'custom'`.

## Decisions

### Shared validation bounds live in `constants/shared.ts`
Cross-domain bounds (`MIN_NAME_LENGTH=3`, `MAX_NAME_LENGTH=32`, `MIN_GROWTH_RATE=0`, `MAX_GROWTH_RATE=200`, `DEFAULT_GROWTH_RATE=6`, `MIN_PERCENTAGE=0`, `MAX_PERCENTAGE=100`) are extracted from `planConstants.ts` into a new `constants/shared.ts`. The differing name lengths across domains (2, 3, 50) were drift, not intent — standardised to min=3, max=32.

### Domain-specific constants stay in their own files
IRS contribution limits, domain-specific ranges (e.g. `MAX_INTEREST_RATE`, `MAX_RESERVE_MONTHS`) remain in `constants/TaxDeferredConstants.ts`, `constants/DebtConstants.ts`, etc. Only genuinely cross-domain values move to `shared.ts`.

### `*defaults` objects belong in `constants/`, not `types/`
`types/` files contain only types (`Tables<>`, `*Insert`, `*Update`, union aliases). Form defaults (`*defaults`) move to the domain constants file so all configuration for a domain is co-located and `types/` stays clean. The typed `*Insert` annotation on each defaults object is preserved — constants files import the type from `types/`.

### Create and Edit forms are separate components
The single `Form.vue` with `mode: 'create' | 'edit' | 'view'` prop is replaced by `CreateForm.vue` and `EditForm.vue` per domain. Tracked in issues #20 (composable refactor) and #21 (form split).

### `useCrudFormWithValidation` is replaced by `useCrudForm`
The composable no longer owns emit logic or distinguishes create vs update. Tracked in issue #20.

### Project settings / DB-backed defaults deferred
Storing form defaults in a Supabase `settings` table was considered and deferred — no concrete actor needs to change defaults without a deploy, and the template system already covers the user-configurable case.