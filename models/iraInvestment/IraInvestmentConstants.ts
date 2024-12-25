import {IraContributionStrategy} from "~/models/iraInvestment/IraInvestment";

export const DEFAULT_IRA_BALANCE: number = 0
export const IRA_DEFAULT_YEAR = 2024
export const IRA_CONTRIBUTION_LIMIT_2024 = 7000
export const IRA_CONTRIBUTION_CATCH_UP_LIMIT_2024 = 8000
export const IRA_LIMIT_INFLATION_RATE: number = 2.5
export const IRA_CATCH_UP_AGE = 50
export const DEFAULT_IRA_GROWTH_RATE: number = 6
export const DEFAULT_IRA_CONTRIBUTION_STRATEGY: IraContributionStrategy = IraContributionStrategy.PercentageOfIncome
export const DEFAULT_IRA_CONTRIBUTION_PERCENTAGE: number = 0
export const DEFAULT_IRA_IS_CONTRIBUTION_TAX_DEFERRED: boolean = false
export const DEFAULT_IRA_CONTRIBUTION_FIXED_AMOUNT: number = 0