import type {HsaInsert} from '#shared/types/Hsa'
import {DEFAULT_GROWTH_RATE} from './shared'

export const HSA_DEFAULT_YEAR = 2024
export const HSA_CONTRIBUTION_LIMIT_2024 = 4_150
export const HSA_CONTRIBUTION_CATCH_UP_LIMIT_2024 = 5_150
export const HSA_LIMIT_INFLATION_RATE: number = 2.5
export const HSA_CATCH_UP_AGE = 55

export const hsaDefaults: HsaInsert = {
    name: 'HSA',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    contribution_strategy: 'fixed',
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}