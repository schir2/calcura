import type {EmployerContributionStrategy, TaxDeferredContributionStrategy} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

export const TAX_DEFERRED_DEFAULT_BALANCE: number = 0
export const TAX_DEFERRED_DEFAULT_YEAR = 2024
export const TAX_DEFERRED_CONTRIBUTION_LIMIT_2024 = 69_000
export const TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2024 = 23_000
export const TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2024 = 7500
export const TAX_DEFERRED_LIMIT_INFLATION_RATE: number = 2.5
export const TAX_DEFERRED_CATCH_UP_AGE = 50
export const DEFAULT_EMPLOYER_CONTRIBUTES: boolean = true

export const DEFAULT_EMPLOYER_CONTRIBUTION_STRATEGY: EmployerContributionStrategy = 'percentage_of_contribution'
export const DEFAULT_EMPLOYER_COMPENSATION_MATCH_PERCENTAGE: number = 0
export const DEFAULT_EMPLOYER_CONTRIBUTION_FIXED_AMOUNT: number = 0
export const DEFAULT_EMPLOYER_MATCH_PERCENTAGE: number = 100
export const DEFAULT_TAX_DEFERRED_GROWTH_RATE: number = 6
export const DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY: TaxDeferredContributionStrategy = 'none'
export const DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE: number = 0

export const DEFAULT_EMPLOYER_MATCH_PERCENTAGE_LIMIT: number = 3

export const DEFAULT_ELECTIVE_CONTRIBUTION_FIXED_AMOUNT: number = 0