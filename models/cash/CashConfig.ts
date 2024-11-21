import {CASH_TEMPLATE} from "~/models/cash/constants";

export type CashMaintenanceStrategy = 'fixedCashReserve' | 'variableCashReserve'

export interface CashData {
    name: string,
    cashMaintenanceStrategy: CashMaintenanceStrategy
    reserveAmount: number,
    reserveMonths: number,
}

export default class CashConfig {
    name: string
    cashMaintenanceStrategy: CashMaintenanceStrategy
    reserveAmount: number
    reserveMonths: number

    constructor(data: CashData) {
        this.name = data.name;
        this.cashMaintenanceStrategy = data.cashMaintenanceStrategy;
        this.reserveAmount = data.reserveAmount;
        this.reserveMonths = data.reserveMonths;
    }

    static defaultValues(template?: keyof typeof CASH_TEMPLATE): CashData {
        return CASH_TEMPLATE[template ?? 'default']
    }

}