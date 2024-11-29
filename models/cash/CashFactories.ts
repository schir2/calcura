import type CashConfig from "~/models/cash/CashConfig";
import {DEFAULT_CASH_MAINTENANCE_NAME, DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT, DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS, DEFAULT_CASH_MAINTENANCE_STRATEGY} from "~/models/cash/CashConstants";

export function defaultCashFactory(): CashConfig {
    return {
        name: DEFAULT_CASH_MAINTENANCE_NAME,
        initialAmount: 0,
        cashMaintenanceStrategy: DEFAULT_CASH_MAINTENANCE_STRATEGY,
        reserveAmount: DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT,
        reserveMonths: DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS,
    }
}