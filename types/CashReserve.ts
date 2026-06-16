export enum CashReserveStrategy {Fixed = 'fixed', Variable = 'variable'}

export type CashReserve = {
    id: number
    name: string
    initial_amount: number
    contribution_strategy: CashReserveStrategy
    reserve_amount: number
    reserve_months: number
}

export type CashReservePartial = Partial<Omit<CashReserve, 'id'>>

export interface CashReserveTemplate extends CashReserve {
    description: string,
}

export const cashReserveDefaults: CashReservePartial = {
    name: 'Blank Reserve',
    initial_amount: 0,
    contribution_strategy: CashReserveStrategy.Fixed,
    reserve_amount: 0,
    reserve_months: 0,
}