import type {ModelName} from "#shared/types/ModelName"

/**
 * Canonical model-priority order applied when a command sequence's
 * `ordering_type` is `'predefined'`. Lower number = processed earlier.
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