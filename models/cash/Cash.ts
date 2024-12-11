export type CashMaintenanceStrategy = 'fixedCashReserve' | 'variableCashReserve'

export  interface Cash {
    id?: number;
    name: string,
    initialAmount: number,
    cashMaintenanceStrategy: CashMaintenanceStrategy
    reserveAmount: number,
    reserveMonths: number,
}