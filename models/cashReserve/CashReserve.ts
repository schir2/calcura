export enum CashReserveStrategy {Fixed = 'Fixed', Variable = 'Variable'}

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
    cashReserveStrategy: CashReserveStrategy.Fixed,
    reserveAmount: 0,
    reserveMonths: 0,
}