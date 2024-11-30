import type IraInvestmentConfig from "~/models/ira/IraInvestmentConfig";
import {DEFAULT_IRA_BALANCE, DEFAULT_IRA_CONTRIBUTION_PERCENTAGE, DEFAULT_IRA_CONTRIBUTION_STRATEGY, DEFAULT_IRA_GROWTH_RATE} from "~/models/ira/IraInvestmentConstants";
import {DEFAULT_GROWTH_APPLICATION_STRATEGY} from "~/constants/financial";

export function rothIraInvestmentFactory(): IraInvestmentConfig {
    return {
        name: 'Roth IRA',
        iraType: 'taxExempt',

        growthRate: DEFAULT_IRA_GROWTH_RATE,
        growthApplicationStrategy: DEFAULT_GROWTH_APPLICATION_STRATEGY,
        initialBalance: DEFAULT_IRA_BALANCE,

        contributionStrategy: DEFAULT_IRA_CONTRIBUTION_STRATEGY,
        contributionPercentage: DEFAULT_IRA_CONTRIBUTION_PERCENTAGE,
        contributionFixedAmount: 0,


    }
}
