export type CashMaintenanceStrategy = 'fixedCashReserve' | 'variableCashReserve'

export default interface CashConfig {
    name: string,
    initialAmount: number,
    cashMaintenanceStrategy: CashMaintenanceStrategy
    reserveAmount: number,
    reserveMonths: number,
}