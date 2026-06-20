import type {RothIraInsert} from '#shared/types/RothIra'
import {DEFAULT_GROWTH_RATE} from './shared'

export const ROTH_IRA_DEFAULT_YEAR = 2024
export const ROTH_IRA_CONTRIBUTION_LIMIT_2024 = 7_000
export const ROTH_IRA_CONTRIBUTION_CATCH_UP_LIMIT_2024 = 8_000
export const ROTH_IRA_LIMIT_INFLATION_RATE: number = 2.5
export const ROTH_IRA_CATCH_UP_AGE = 50

export const rothIraDefaults: RothIraInsert = {
    name: 'Roth IRA',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    contribution_strategy: 'fixed',
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}