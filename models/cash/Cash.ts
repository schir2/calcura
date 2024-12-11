export type CashMaintenanceStrategy = 'fixedCashReserve' | 'variableCashReserve'

export default interface Cash {
    id?: number;
    name: string,
    initialAmount: number,
    cashMaintenanceStrategy: CashMaintenanceStrategy
    reserveAmount: number,
    reserveMonths: number,
}