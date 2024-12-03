export type CashMaintenanceStrategy = 'fixedCashReserve' | 'variableCashReserve'

export default interface CashConfig {
    id?: number;
    name: string,
    initialAmount: number,
    cashMaintenanceStrategy: CashMaintenanceStrategy
    reserveAmount: number,
    reserveMonths: number,
}