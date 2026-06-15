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
└── cashReserve/
    └── CashReserveManager.ts
```

## Manager / Orchestrator pattern

Each financial entity (income, expense, debt, brokerage, etc.) has a Manager class:
- Extends `BaseManager<TConfig, TState>`
- `TConfig` is the configuration interface (the DB row type from `types/`)
- `TState` is the year-end state type (from `types/*State.ts`)
- Must implement `process()` — computes the current year's state
- Must implement `advanceTimePeriod()` — transitions state to the next year

`PlanManager` extends `BaseOrchestrator` and:
- Instantiates all domain managers from plan data
- Runs the simulation loop until the retirement strategy condition is met
- Tracks annual contribution limits (IRS limits for IRA, 401k, etc.)

## Data flow

```
Supabase (snake_case row)
  → types/Income.ts interface
  → IncomeManager(config: Income)
  → manager.process() → IncomeState (computed values, camelCase internally ok)
  → PlanManager aggregates all states
  → simulation result displayed in components
```

## Naming conventions

Config interfaces (input from DB) use **snake_case** (matching the DB schema and `types/` interfaces).

Internal computation variables within manager methods may use **camelCase** for readability:
```typescript
process(): IncomeState {
  const grossIncome = this.config.gross_income  // snake_case from config
  const growthRate = this.config.growth_rate    // snake_case from config
  const adjustedIncome = grossIncome * (1 + growthRate)  // camelCase locally — fine
  // ...
}
```

State types (`*State.ts`) may use camelCase for computed values since they are never serialized to or from the DB.

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
