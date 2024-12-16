export type CashReserveStrategy = 'fixed' | 'variable'

export interface CashReserve {
    id: number;
    name: string,
    initialAmount: number,
    cashReserveStrategy: CashReserveStrategy
    reserveAmount: number,
    reserveMonths: number,
}

export type CashReservePartial = Partial<Omit<CashReserve, 'id'>>

export interface CashReserveTemplate extends CashReserve {
    description: string,
}

export const cashReserveDefaults: CashReservePartial = {
    name: 'Blank Reserve',
    initialAmount: 0,
    cashReserveStrategy: 'fixed',
    reserveAmount: 0,
    reserveMonths: 0,
}