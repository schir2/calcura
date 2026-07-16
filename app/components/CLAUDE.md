# components/ — Conventions

## Directory structure

```
components/
├── base/           # Primitives (Ico, NumberSlider, Sparkline, ThemeSwitcher)
├── command/        # Simulation drawer — sequence tabs + draggable command rows
├── common/         # Shared UI — the Entity Workspace, Rich List Item, projections
├── dashboard/      # Tool cards for the /dashboard hub
├── landing/        # Public landing page
├── layout/         # Structural chrome (TheNavbar, TheLeftSidebar)
├── plan/           # Plan components + plan/chart/ and plan/overview/
├── profile/        # Profile form
│
├── brokerage/      # ─┐
├── cashReserve/    #  │
├── debt/           #  │
├── expense/        #  │  the nine domains — each owns exactly:
├── hsa/            #  ├─ WorkspaceForm.vue
├── income/         #  │  WorkspaceProjection.vue (or reuses CommonEntityProjection)
├── ira/            #  │  ListItem.vue
├── rothIra/        #  │
└── taxDeferred/    # ─┘
```

Domain directory names are **camelCase** (`cashReserve/`, `rothIra/`, `taxDeferred/`) even though the DB tables are snake_case. There is no snake_case variant — do not create one.

## Component rules

### Naming
- Domain component directories should match the DB table name (snake_case plural): `income/`, `expense/`, `debt/`, `brokerage/`, etc.
- Component files use PascalCase: `WorkspaceForm.vue`, `WorkspaceProjection.vue`, `ListItem.vue`
- One responsibility per component

### The per-domain component set
Since [ADR 012](../../docs/adr/012-retire-legacy-modal-form-stack.md), a domain owns exactly three components. The legacy `CreateForm` / `UpdateForm` / `List` / `TemplatePicker` set is **deleted** — do not recreate it.

| Component | Role |
|---|---|
| `WorkspaceForm.vue` | The settings form, left pane of the Entity Workspace drawer. Handles create **and** edit as modes of one component. |
| `WorkspaceProjection.vue` | The domain's live projection readout, right pane. (Growth investments may reuse `CommonEntityProjection` instead.) |
| `ListItem.vue` | The domain's Rich List Item row in the simulation drawer. Its edit affordance opens the Workspace. |

Both Workspace components must be registered in `common/EntityWorkspace.vue`'s `formComponent` / `projectionComponent` switches. That registration is what makes the domain editable — there is no separate enable list and no fallback.

#### Template selection in `WorkspaceForm` (#136)
Templates are surfaced *inside* the create-mode form — there is no standalone `TemplatePicker` (deleted by ADR 012; do not recreate it). The seed plumbing is shared and already done: `workspace.openCreate(model, planId, seed?)` carries optional seed values and the drawer passes them as `:initial-values`. To add template selection to a domain (see `debt/WorkspaceForm.vue` as the reference):
1. Accept `initialValues?: Partial<T> | null` and merge it over the create defaults **only in create mode**: `{...defaults, ...(id === null ? initialValues : undefined)}`.
2. In create mode, fetch from `use<Domain>TemplateStore` and render a "Start from a template" `n-select`; on select, `model.value = processTemplate(defaults, template)` (template wins, defaults fill gaps — `~/utils/templateProcessorUtils`).
3. Seed real `*_template` rows via a migration so the picker isn't empty.

The plumbing already covers every domain; steps 1–3 are the only per-domain work.

### Data handling
- Components receive data via props — they do not call Supabase directly
- All data fetching goes through composables in `composables/api/`
- Field names in template bindings follow Vue convention (camelCase), but the underlying data properties are snake_case (matching the DB)
- Example: `:growth-rate="income.growth_rate"` — prop is camelCase, data is snake_case

### Forms
- Use NaiveUI `<n-form :rules>` for all form validation
- Rules live in `utils/validators/[domain]Rules.ts` (see `app/utils/validators/CLAUDE.md`)
- Form field names must match snake_case interface properties exactly

### Emits

Always use typed `defineEmits` with the Vue 3.3+ tuple syntax. Never use the untyped array form.

```typescript
// CORRECT
const emit = defineEmits<{
  create: [insert: PlanInsert]
  update: [id: number, update: PlanUpdate]
  delete: [id: number]
  cancel: []
}>()

// WRONG — untyped
const emit = defineEmits(['create', 'update', 'delete', 'cancel'])
```

**Standard emit signatures:**
- `create` — one arg named `insert`, typed as the domain's Supabase Insert type (e.g. `PlanInsert`)
- `update` — two args: `id: number` then `update` typed as the domain's Supabase Update type (e.g. `PlanUpdate`)
- `delete` — one arg: `id: number` only — never the full entity
- `cancel` — no args

**Page handler signatures must mirror the emit exactly:**
```typescript
async function handleCreatePlan(insert: PlanInsert) { ... }
async function handleUpdatePlan(id: number, update: PlanUpdate) { ... }
async function handleDeletePlan(id: number) { ... }
```

**Payload types — always use Supabase-derived types, never `Partial<Model>`:**
```typescript
// CORRECT
create: [insert: IncomeInsert]   // TablesInsert<'income'>
update: [id: number, update: IncomeUpdate]  // TablesUpdate<'income'>

// WRONG — hand-crafted Partial
create: [insert: Partial<Income>]
create: [insert: IncomePartial]
```

`*Partial` types (`IncomePartial`, `DebtPartial`, etc.) are deprecated. Use `*Insert` / `*Update` everywhere. Page handler signatures follow the same rule.

**Naming rules:**
- Always use the generic operation name — never prefix with the entity (`deleteRetirement`, `updateIncome` are violations)
- `delete` not `remove`, `update` not `edit` — one name per operation, no synonyms
- No naming clash exists when a page listens to `@update` from multiple components — Vue scopes each component's events to its own listener, so the page just binds different handlers per component

**Aggregator components** that tunnel events from multiple domains through a single channel (e.g. `CommandTabber`) must wrap payloads with `{ modelName, data }` to carry routing metadata rather than using namespaced event names.

### Styling
- All color/radius/elevation follows [`docs/design-system.md`](../../docs/design-system.md). Color = `skin` tokens (`bg-skin-*`, `text-skin-*`); never raw Tailwind colors (`text-red-500`, `text-white`).
- Tailwind is for layout/spacing only; always use a NaiveUI component when one exists.

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
