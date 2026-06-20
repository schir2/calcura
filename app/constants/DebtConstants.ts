import type {DebtInsert} from '#shared/types/Debt'

export const MIN_INTEREST_RATE: number = 0
export const MAX_INTEREST_RATE: number = 50
export const MIN_PAYMENT: number = 1
export const MAX_PAYMENT: number = 1_000_000

export const debtDefaults: DebtInsert = {
    name: 'Debt',
    principal: 0,
    interest_rate: 0,
    payment_minimum: 0,
    payment_strategy: 'fixed',
    payment_fixed_amount: 0,
    payment_percentage: 0,
    frequency: 'monthly',
}