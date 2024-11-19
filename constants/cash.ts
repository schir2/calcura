import type {CashData} from "~/models/Cash";

export const DEFAULT_CASH_MAINTENANCE_NAME = 'Cash Reserve 6 months of Expenses';
export const DEFAULT_CASH_MAINTENANCE_STRATEGY = 'variableCashReserve';
export const DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT = 0;
export const DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS = 6;

export const MIN_RESERVE_AMOUNT = 0;
export const MAX_RESERVE_AMOUNT = 100_000_000;
export const MIN_RESERVE_MONTHS = 1;
export const MAX_RESERVE_MONTHS = 60;

export const CASH_TEMPLATE: Record<string, CashData> = {
    default: {
        name: DEFAULT_CASH_MAINTENANCE_NAME,
        cashMaintenanceStrategy: DEFAULT_CASH_MAINTENANCE_STRATEGY,
        reserveAmount: DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT,
        reserveMonths: DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS,
    }
}