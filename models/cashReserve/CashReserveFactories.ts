import type {CashReserve, CashReservePartial} from "~/models/cashReserve/CashReserve";
import {DEFAULT_CASH_MAINTENANCE_NAME, DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT, DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS, DEFAULT_CASH_MAINTENANCE_STRATEGY} from "~/models/cashReserve/CashReserveConstants";

export function defaultCashReserveFactory(): CashReservePartial {
    return {
        name: DEFAULT_CASH_MAINTENANCE_NAME,
        initialAmount: 0,
        cashReserveStrategy: DEFAULT_CASH_MAINTENANCE_STRATEGY,
        reserveAmount: DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT,
        reserveMonths: DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS,
    }
}