import type {PlanWithRelations} from '#shared/types/Plan'
import type {Database} from '#shared/types/database.types'
import PlanManager from '~/models/plan/PlanManager'

// One nested select loads every plan WITH all its relations in a single round trip.
// Child tables all have a FK to `plan`, so PostgREST can embed them (mirrors the
// command-sequence nested query). Aliased to the plural PlanWithRelations keys.
// Whitespace stripped — PostgREST select strings must not contain newlines/indentation.
const PLAN_WITH_RELATIONS_QUERY = `
  *,
  incomes:income(*),
  expenses:expense(*),
  debts:debt(*),
  brokerages:brokerage(*),
  iras:ira(*),
  roth_iras:roth_ira(*),
  tax_deferreds:tax_deferred(*),
  cash_reserves:cash_reserve(*),
  hsas:hsa(*),
  command_sequences:command_sequence(
    *,
    command_sequence_commands:command_sequence_command(*, command(*))
  )
`.replace(/\s+/g, '')

export type PlanProjection = {
    ages: number[]
    lifetime: number[] // total savings per year (accumulate → draw down)
    depletionAge: number | null
}

export type SimulatedPlan = {
    plan: PlanWithRelations
    projection: PlanProjection
}

function buildProjection(planManager: PlanManager, states: ReturnType<PlanManager['simulate']>): PlanProjection {
    return {
        ages: states.map(state => state.plan.age),
        // engine's own "savings end of year" (matches canRetire()/processImplementation())
        lifetime: states.map(state =>
            state.assets.tax_deferred.balance_end +
            state.assets.tax_exempt.balance_end +
            state.assets.taxable.balance_end +
            state.cash.net,
        ),
        depletionAge: planManager.getDepletionAge(),
    }
}

// Loads all of the user's plans with relations and simulates each in its own isolated
// PlanManager — deliberately NOT using orchestratorStore or the singleton domain stores
// (their setAll wipes on each fetch, so they can't hold N plans at once).
export function usePlanSimulations() {
    const client = useSupabaseClient<Database>()
    const results = ref<SimulatedPlan[]>([])
    const pending = ref(true)

    async function refresh() {
        pending.value = true
        try {
            const {data, error} = await client.from('plan').select(PLAN_WITH_RELATIONS_QUERY)
            if (error) throw error
            const plans = (data ?? []) as unknown as PlanWithRelations[]
            results.value = plans.map((plan) => {
                const planManager = new PlanManager(plan)
                const states = planManager.simulate(plan.command_sequences[0])
                return {plan, projection: buildProjection(planManager, states)}
            })
        } finally {
            pending.value = false
        }
    }

    onMounted(refresh)

    return {results, pending, refresh}
}
