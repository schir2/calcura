import type {Tables, TablesInsert, TablesUpdate} from '~/types/database.types'

export type CashReserve = Tables<'cash_reserve'>
export type CashReserveTemplate = Tables<'cash_reserve_template'>

export type CashReserveStrategy = CashReserve['cash_reserve_strategy']

export type CashReserveInsert = TablesInsert<'cash_reserve'>
export type CashReserveUpdate = TablesUpdate<'cash_reserve'>

export const cashReserveDefaults: CashReserveInsert = {
    name: 'Blank Reserve',
    initial_amount: 0,
    cash_reserve_strategy: 'fixed',
    reserve_amount: 0,
    reserve_months: 0,
}