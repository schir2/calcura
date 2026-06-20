import type {CashReserveInsert} from '#shared/types/CashReserve'

export const MIN_RESERVE_AMOUNT = 0
export const MAX_RESERVE_AMOUNT = 100_000_000
export const MIN_RESERVE_MONTHS = 0
export const MAX_RESERVE_MONTHS = 60

export const cashReserveDefaults: CashReserveInsert = {
    name: 'Cash Reserve',
    initial_amount: 0,
    cash_reserve_strategy: 'fixed',
    reserve_amount: 0,
    reserve_months: 0,
}
