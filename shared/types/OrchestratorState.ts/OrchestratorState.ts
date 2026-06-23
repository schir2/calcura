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