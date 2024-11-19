import {CASH_TEMPLATE} from "~/constants/cash";

export type CashMaintenanceStrategy = 'fixedCashReserve' | 'variableCashReserve'

export interface CashData {
    name: string,
    cashMaintenanceStrategy: CashMaintenanceStrategy
    reserveAmount: number,
    reserveMonths: number,
}

export default class Cash {
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