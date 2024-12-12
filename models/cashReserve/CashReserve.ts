export type CashReserveStrategy = 'fixedCashReserve' | 'variableCashReserve'

export interface CashReserve {
    id: number;
    name: string,
    initialAmount: number,
    cashReserveStrategy: CashReserveStrategy
    reserveAmount: number,
    reserveMonths: number,
}

export type CashReservePartial = Partial<Omit<CashReserve, 'id'>>