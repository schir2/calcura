import type {InvestmentState} from "#shared/types/InvestmentState";

// cost_basis tracks post-tax contributed dollars (the amount already taxed as income), so retirement
// withdrawals tax only the gain via pro-rata (average-cost). See CONTEXT.md "Cost basis" / "Pro-rata basis".
export type BrokerageState = InvestmentState & {
    cost_basis: number
}