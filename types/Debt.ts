import type {Tables, TablesInsert, TablesUpdate} from '~/types/database.types'

export type Debt = Tables<'debt'>
export type DebtTemplate = Tables<'debt_template'>

export type DebtPaymentStrategy = Debt['payment_strategy']

export type DebtInsert = TablesInsert<'debt'>
export type DebtUpdate = TablesUpdate<'debt'>

export const debtDefaults: DebtInsert = {
    name: 'Debt',
    principal: 0,
    interest_rate: 0,
    payment_minimum: 0,
    payment_strategy: 'fixed',
    payment_fixed_amount: 0,
    payment_percentage: 0,
    frequency: 'monthly'
}