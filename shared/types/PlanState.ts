import type {BaseState} from "#shared/types/BaseState"

export type PlanState = BaseState & {
    age: number
    year: number

    gross_income: number
    taxable_income: number
    taxed_income: number
    AGI: number

    taxable_capital: number
    taxed_capital: number
    taxed_withdrawals: number

    elective_limit: number
    deferred_limit: number
    ira_limit: number

    inflation_rate: number

    /* Contributions */
    tax_deferred_contributions: number
    taxable_contributions: number
    tax_exempt_contributions: number

    tax_deferred_contributions_lifetime: number
    taxable_contributions_lifetime: number
    tax_exempt_contributions_lifetime: number


    /* Savings */
    savings_tax_deferred_start_of_year: number
    savings_tax_deferred_end_of_year: number

    savings_tax_exempt_start_of_year: number
    savings_tax_exempt_end_of_year: number

    savings_taxable_start_of_year: number
    savings_taxable_end_of_year: number

    savings_start_of_year: number
    savings_end_of_year: number

    debt_start_of_year: number
    dept_end_of_year: number

    debt_payments: number
    debt_payments_lifetime: number

    expenses_total: number
    expenses_paid: number
    expenses_shortfall: number

    expenses_total_lifetime: number
    expenses_paid_lifetime: number
    expenses_shortfall_lifetime: number

    cash_reserves_total: number

    retirement_income_projected: number
    retirement_income_goal: number
    retired: boolean

}

export type AssetCategoryState = {
    contribution: number
    contribution_lifetime: number
    balance_start: number
    balance_end: number
}

export type LiabilityCategoryState = {
    balance_start: number
    balance_end: number
    paid: number
    shortfall: number
    paid_lifetime: number
    shortfall_lifetime: number
}

export type OrchestratorState = {
    retired: boolean

    plan: {
        age: number
        year: number
        inflation_rate: number
        retirement_income_projected: number
        retirement_income_goal: number
    }

    income: {
        gross: number
        taxable: number
        net: number
        agi: number

        gross_lifetime: number
        taxable_lifetime: number
        net_lifetime: number
        agi_lifetime: number
    }

    cash: {
        taxable: number
        net: number
        spent: number
    }

    limits: {
        elective: number
        employer: number
        deferred: number
        ira: number
    }

    assets: {
        tax_deferred: AssetCategoryState
        taxable: AssetCategoryState
        tax_exempt: AssetCategoryState
        cash_reserve: AssetCategoryState
    }

    liabilities: {
        debt: LiabilityCategoryState,
        expense: LiabilityCategoryState
    }
}
