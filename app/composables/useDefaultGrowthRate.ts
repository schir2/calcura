import {DEFAULT_GROWTH_RATE} from '~/constants/shared'

// `plan.growth_rate` is the plan-level default *investment return*, applied to newly created
// investment accounts (brokerage / IRA / Roth / HSA / 401k).
//
// It is a SEED, not a source. Read once when a create-mode form builds its model; once an account
// exists it owns its own growth_rate, and changing the plan's default never rewrites it. Same
// seed-not-reference rule the profile follows (ADR 014).
//
// Deliberately NOT applied to income or expense: their `growth_rate` is a raise rate and a cost
// inflation rate respectively — different quantities that both default to 0. Seeding them from an
// investment return would claim your salary and your rent grow at the market's rate.
export function useDefaultGrowthRate(): number {
    const orchestrator = orchestratorStore()
    return orchestrator.plan?.growth_rate ?? DEFAULT_GROWTH_RATE
}
