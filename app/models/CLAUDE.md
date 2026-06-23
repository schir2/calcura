# models/ — Conventions

## Purpose

This directory contains the **pure-frontend financial simulation engine**. It has no dependency on any API, store, or Supabase. It takes configuration data, simulates year-by-year financial outcomes, and returns state histories.

**Do not add API calls, store access, or Supabase imports here.**

## Directory structure

```
models/
├── common/
│   ├── BaseManager.ts       # Abstract base for all financial entity managers
│   └── BaseOrchestrator.ts  # Coordinates multiple managers
├── plan/
│   └── PlanManager.ts       # Central orchestrator — runs the full simulation
├── income/
│   └── IncomeManager.ts
├── expense/
│   └── ExpenseManager.ts
├── debt/
│   └── DebtManager.ts
├── brokerage/
│   └── BrokerageManager.ts
├── ira/
│   └── IraManager.ts
├── rothIra/
│   └── RothIraManager.ts
├── taxDeferred/
│   └── TaxDeferredManager.ts
├── cashReserve/
│   └── CashReserveManager.ts
└── hsa/
    └── HsaManager.ts
```

## Manager / Orchestrator pattern

Each financial entity (income, expense, debt, brokerage, etc.) has a Manager class:
- Extends `BaseManager<TConfig, TState>`
- `TConfig` is the configuration interface (the DB row type from `types/`)
- `TState` is the year-end state type (from `types/*State.ts`)
- Must implement `processImplementation()` — computes the current year's state
- Must implement `createNextState()` — transitions state to the next year

`PlanManager` extends `BaseOrchestrator` and:
- Instantiates all domain managers from plan data
- Runs the simulation loop until the retirement strategy condition is met
- Tracks annual contribution limits (IRS limits for IRA, HSA, 401k, etc.)

## Data flow

```
Supabase (snake_case row)
  → types/Income.ts interface
  → IncomeManager(config: Income)
  → manager.process() → IncomeState (computed values)
  → PlanManager aggregates all states
  → simulation result displayed in components
```

## Naming conventions

Config interfaces (input from DB) use **snake_case** (matching the DB schema and `types/` interfaces).

Internal computation variables within manager methods may use **camelCase** for readability:
```typescript
processImplementation() {
  const grossIncome = this.config.gross_income  // snake_case from config
  const growthRate = this.config.growth_rate    // snake_case from config
  const adjustedIncome = grossIncome * (1 + growthRate)  // camelCase locally — fine
}
```

State types (`*State.ts`) use snake_case field names to match the DB schema convention.

## Testing

Tests live in `tests/models/`. Each manager should have a corresponding test file.

Run all model tests:
```bash
npx vitest run tests/models/
```

Run a single test:
```bash
npx vitest run tests/models/plan/PlanManager.test.ts
```

## Rules

- **No API calls, stores, or Supabase** — pure computation only
- **No side effects** — managers return computed state; they do not persist anything
- Config interfaces must use **snake_case field names** (ADR 005)
- Do not modify this directory when doing API migration work (issues #4–#15)
- If a config field name needs updating due to the snake_case sweep, update the property access — do not rename internal computation variables

---

## How to add a new manager

Use `HsaManager` as the reference implementation. These are the steps in order:

### 1. Confirm the DB schema exists

The `hsa` table must exist in `shared/types/database.types.ts` before anything else. If not, write a migration first (`supabase migration new <name>`) then regenerate types.

### 2. Create the config type (`shared/types/<Entity>.ts`)

Mirror the existing pattern:

```typescript
import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type Hsa = Tables<'hsa'>
export type HsaInsert = TablesInsert<'hsa'>
export type HsaUpdate = TablesUpdate<'hsa'>
```

### 3. Create the state type (`shared/types/<Entity>State.ts`)

For investment-style accounts (balance + contribution + growth), extend `InvestmentState`:

```typescript
import type {InvestmentState} from "#shared/types/InvestmentState";
export type HsaState = InvestmentState
```

Add extra fields only if the entity tracks values not covered by `InvestmentState` (e.g. `DebtState` tracks `principal`, `interest_paid`).

### 4. Add constants and a limit utility (if contribution-limited)

`app/constants/<Entity>Constants.ts` — IRS limits, default values:
```typescript
export const HSA_CONTRIBUTION_LIMIT_2024 = 4_150
export const HSA_CATCH_UP_AGE = 55
export const hsaDefaults: HsaInsert = { ... }
```

`app/utils/get<Entity>Limit.ts` — projects the limit forward from a base year using `calculateCompoundInterest`:
```typescript
export function getHsaLimit(year: number, age: number): number { ... }
```

Export it from `app/utils/index.ts`.

### 5. Create the manager (`app/models/<entity>/<Entity>Manager.ts`)

Implement these three methods and one standalone pure function:

```typescript
export class HsaManager extends BaseManager<Hsa, HsaState> {
    protected createInitialState(): HsaState { ... }
    createNextState(previousState: HsaState): HsaState { ... }
    processImplementation(): void { ... }
}

export function calculateHsaContribution(config: Hsa, limit: number): number { ... }
```

Key decisions inside `processImplementation()`:
- **`FundType`** — where money comes from:
  - `FundType.Taxable` = pre-tax income (IRA, TaxDeferred, HSA)
  - `FundType.Taxed` = post-tax income (Brokerage, RothIra)
- **`ContributionType`** — which bucket the contribution goes into (must be registered in steps 6–7)

### 6. Register the ContributionType and ContributionLimitType

`shared/types/ContributionType.ts` — add the new value:
```typescript
Hsa = 'hsa',
```

`shared/types/Plan.ts` — add to `ContributionLimitType` if the entity has an IRS annual limit:
```typescript
Hsa = 'hsa',
```

### 7. Wire up PlanManager (`app/models/plan/PlanManager.ts`)

Six touch points, all mechanical:

| Location | Change |
|---|---|
| `PlanManagers` type | Add `hsa: HsaManager[]` |
| `createManagers()` | `hsa: this.config.hsas.map(h => new HsaManager(this, h))` |
| `createInitialState()` | Add `hsa_limit: getHsaLimit(year, age)` |
| `createNextState()` | Add `hsa_limit: getHsaLimit(year, age)` |
| `_adjustContributionLimit()` | Add `case ContributionLimitType.Hsa:` |
| `contribute()` | Add `case ContributionType.Hsa:` |
| `invest()` | Add `case ContributionType.Hsa:` — pick the right savings bucket |
| `getLimitForContributionType()` | Add `case ContributionLimitType.Hsa:` |

The `invest()` bucket mapping:
- Tax-deferred growth → `savings_tax_deferred_end_of_year` (IRA, TaxDeferred, HSA)
- Tax-exempt growth → `savings_tax_exempt_end_of_year` (RothIra)
- Taxable growth → `savings_taxable_end_of_year` (Brokerage)

### 8. Add the entity to `PlanWithRelations` (`shared/types/Plan.ts`)

```typescript
export type PlanWithRelations = Plan & {
    ...
    hsas: Hsa[]
}
```

### 9. Add `hsa_limit` to `PlanState` (`shared/types/PlanState.ts`)

Only required if you added a `ContributionLimitType` in step 6:

```typescript
hsa_limit: number
```

### 10. Write tests (`tests/models/<entity>/`)

Test the standalone contribution function with representative cases:
- `fixed` strategy
- `max` strategy (capped at limit)
- `percentage_of_income` if supported

Then test the manager via `PlanManager.simulate()` with a minimal plan config.