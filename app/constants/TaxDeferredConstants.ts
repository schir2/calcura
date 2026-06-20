import type {TaxDeferredInsert} from '#shared/types/TaxDeferred'
import {DEFAULT_GROWTH_RATE} from './shared'

export const TAX_DEFERRED_DEFAULT_YEAR = 2025
export const TAX_DEFERRED_CONTRIBUTION_LIMIT_2025 = 70_000
export const TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2025 = 23_500
export const TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2025 = 7_500
export const TAX_DEFERRED_LIMIT_INFLATION_RATE: number = 2.5

export const taxDeferredDefaults: TaxDeferredInsert = {
    name: '401k',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    elective_contribution_strategy: 'percentage_of_income',
    elective_contribution_percentage: 0,
    elective_contribution_fixed_amount: 0,
    employer_contributes: false,
    employer_contribution_strategy: null,
    employer_match_percentage: 0,
    employer_compensation_match_percentage: 100,
    employer_contribution_fixed_amount: 0,
    employer_match_percentage_limit: 0,
}