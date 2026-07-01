# utils/validators/ — Form Rules

## What Form Rules are

Each file exports a plain function returning a NaiveUI [`FormRules`](https://www.naiveui.com/en-US/os-theme/components/form) object, consumed by `<n-form :rules>`. They are **not composables** — they use no Vue lifecycle hooks and no reactivity APIs (`ref`, `computed`, `watch`). They only *accept* a `Ref` to read the current model value inside custom validators.

## Why `utils/` not `composables/`

A composable calls the Vue composition API internally. These functions don't — they take a ref in and return a static rules object. Since they hold no composition state, they belong in `utils/`, not `composables/`.

## Naming convention

`[domain]Rules(modelRef)` — one per domain:

`brokerageRules`, `cashReserveRules`, `debtRules`, `expenseRules`, `hsaRules`, `incomeRules`, `iraRules`, `planRules`, `rothIraRules`, `taxDeferredRules`, `userProfileRules`.

Field keys in the returned `FormRules` must match the snake_case interface names from `#shared/types/` (see [ADR 005](../../../docs/adr/005-snake-case-field-names.md)).

## Why every function keeps `modelRef: Ref<Partial<T>>`

The signature is uniform across the whole set for consistency, even though not all functions read the ref today. Functions with cross-field / strategy-dependent rules use it — e.g. `planRules` gates `retirement_age`, `retirement_savings_amount`, `retirement_withdrawal_rate`, and `retirement_income_goal` on `modelRef.value.retirement_strategy`.

The four that currently don't read it — `expenseRules`, `incomeRules`, `iraRules`, `userProfileRules` — keep the parameter anyway so every call site looks the same and so they can add strategy-dependent rules later without a signature change.

## Validation Bounds

The min/max scalar constraints referenced inside these functions (e.g. `MIN_NAME_LENGTH`, `MAX_NAME_LENGTH`, `MIN_GROWTH_RATE`, `MAX_GROWTH_RATE`, `MAX_TAX_RATE`) are **not** defined here. They live in `constants/`:

- **Cross-domain bounds** → `constants/shared.ts` (`MIN_NAME_LENGTH`, `MAX_NAME_LENGTH`, `MIN_GROWTH_RATE`, `MAX_GROWTH_RATE`, `MIN_PERCENTAGE`, `MAX_PERCENTAGE`, `MIN_BALANCE`, …)
- **Domain-specific bounds** → `constants/[Domain]Constants.ts` (e.g. `IraConstants.ts`, `RothIraConstants.ts`)

Keep the numeric bounds in `constants/` and reference them from the rules — never inline magic numbers in a rules function.