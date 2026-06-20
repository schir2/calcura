import type {IraInsert} from '#shared/types/Ira'
import {DEFAULT_GROWTH_RATE} from './shared'

export const IRA_DEFAULT_YEAR = 2024
export const IRA_CONTRIBUTION_LIMIT_2024 = 7_000
export const IRA_CONTRIBUTION_CATCH_UP_LIMIT_2024 = 8_000
export const IRA_LIMIT_INFLATION_RATE: number = 2.5
export const IRA_CATCH_UP_AGE = 50

export const iraDefaults: IraInsert = {
    name: 'Traditional IRA',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    contribution_strategy: 'fixed',
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}