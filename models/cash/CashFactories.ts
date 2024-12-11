import type Cash from "~/models/cash/Cash";
import {DEFAULT_CASH_MAINTENANCE_NAME, DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT, DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS, DEFAULT_CASH_MAINTENANCE_STRATEGY} from "~/models/cash/CashConstants";

export function defaultCashFactory(userId: number): Cash {
    return {
        name: DEFAULT_CASH_MAINTENANCE_NAME,
        initialAmount: 0,
        cashMaintenanceStrategy: DEFAULT_CASH_MAINTENANCE_STRATEGY,
        reserveAmount: DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT,
        reserveMonths: DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS,
    }
}