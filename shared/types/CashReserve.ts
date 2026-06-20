import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type CashReserve = Tables<'cash_reserve'>
export type CashReserveTemplate = Tables<'cash_reserve_template'>

export type CashReserveStrategy = CashReserve['cash_reserve_strategy']

export type CashReserveInsert = TablesInsert<'cash_reserve'>
export type CashReserveUpdate = TablesUpdate<'cash_reserve'>