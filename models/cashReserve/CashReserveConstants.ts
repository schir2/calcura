import type {CashReserveStrategy} from "~/models/cashReserve/CashReserve";
import {CashReserveStrategy} from "~/models/cashReserve/CashReserve";

export const DEFAULT_CASH_MAINTENANCE_NAME = 'Cash Reserve 6 months of Expenses';
export const DEFAULT_CASH_MAINTENANCE_STRATEGY: CashReserveStrategy = CashReserveStrategy.Variable;
export const DEFAULT_CASH_MAINTENANCE_RESERVE_AMOUNT = 0;
export const DEFAULT_CASH_MAINTENANCE_RESERVE_MONTHS = 6;

export const MIN_RESERVE_AMOUNT = 0;
export const MAX_RESERVE_AMOUNT = 100_000_000;
export const MIN_RESERVE_MONTHS = 1;
export const MAX_RESERVE_MONTHS = 60;