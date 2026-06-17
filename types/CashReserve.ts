import type {Enums, TablesInsert, TablesUpdate} from '~/types/database.types'

export type CashReserveStrategy = Enums<'cash_reserve_strategy'>

export type CashReserve = {
    id: number
    name: string
    initial_amount: number
    cash_reserve_strategy: CashReserveStrategy
    reserve_amount: number
    reserve_months: number
}

export type CashReservePartial = Partial<Omit<CashReserve, 'id'>>

export type CashReserveTemplate = CashReserve & {
    description: string,
}

export const cashReserveDefaults: CashReservePartial = {
    name: 'Blank Reserve',
    initial_amount: 0,
    cash_reserve_strategy: 'fixed',
    reserve_amount: 0,
    reserve_months: 0,
}

export type CashReserveInsert = TablesInsert<'cash_reserve'>
export type CashReserveUpdate = TablesUpdate<'cash_reserve'>
