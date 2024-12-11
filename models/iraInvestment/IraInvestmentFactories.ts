import type {IraInvestmentPartial} from "~/models/iraInvestment/IraInvestment";
import {DEFAULT_IRA_BALANCE, DEFAULT_IRA_CONTRIBUTION_PERCENTAGE, DEFAULT_IRA_CONTRIBUTION_STRATEGY, DEFAULT_IRA_GROWTH_RATE, DEFAULT_IRA_IS_CONTRIBUTION_TAX_DEFERRED} from "~/models/iraInvestment/IraInvestmentConstants";

export function defaultIraInvestmentFactory(): IraInvestmentPartial {
    return {
        name: 'Roth IRA',
        isContributionTaxDeferred: DEFAULT_IRA_IS_CONTRIBUTION_TAX_DEFERRED,
        growthRate: DEFAULT_IRA_GROWTH_RATE,
        initialBalance: DEFAULT_IRA_BALANCE,
        contributionStrategy: DEFAULT_IRA_CONTRIBUTION_STRATEGY,
        contributionPercentage: DEFAULT_IRA_CONTRIBUTION_PERCENTAGE,
        contributionFixedAmount: 0,

    }
}
