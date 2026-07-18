import type {ModelName} from "#shared/types/ModelName"

/**
 * Canonical model-priority order applied when a command sequence's
 * `accumulation_ordering_type` is `'predefined'`. Lower number = processed earlier.
 *
 * This is the single source of truth for the predefined algorithm —
 * consumed by both the simulation engine (`PlanManager`) and the
 * command-sequence UI (`CommandSequence.vue`). Do not duplicate it.
 */
export const PREDEFINED_COMMAND_ORDER: Record<ModelName, number> = {
    income: 1,
    debt: 2,
    expense: 3,
    cash_reserve: 4,
    tax_deferred: 5,
    roth_ira: 6,
    ira: 7,
    brokerage: 8,
    hsa: 9,
}

/** Rank of a model in the predefined order; unknown models sort last. */
export function predefinedOrderRank(modelName: ModelName): number {
    return PREDEFINED_COMMAND_ORDER[modelName] ?? 100
}

/**
 * Canonical drain order applied to `withdraw` commands when a command sequence's
 * `withdrawal_ordering_type` is `'predefined'` — distinct from the accumulation order above.
 *
 * By tax category: taxable (cheapest gain-only tax) → tax-deferred (ordinary) → tax-exempt (Roth)
 * → cash_reserve. The cash-reserve emergency fund is pinned **last** even though it is zero-tax,
 * deliberately overriding cheapest-first (see CONTEXT.md "withdrawal_ordering_type"). Spendable
 * cash (`cash.net`) is spent before any of these and is not a command.
 */
export const PREDEFINED_WITHDRAWAL_ORDER: Partial<Record<ModelName, number>> = {
    brokerage: 1,
    tax_deferred: 2,
    ira: 3,
    hsa: 4,
    roth_ira: 5,
    cash_reserve: 6,
}

/** Rank of a model in the predefined withdrawal order; non-drawable models sort last. */
export function predefinedWithdrawalRank(modelName: ModelName): number {
    return PREDEFINED_WITHDRAWAL_ORDER[modelName] ?? 100
}