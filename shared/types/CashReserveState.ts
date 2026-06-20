import type {BaseState} from "#shared/types/BaseState";

export type CashReserveState = BaseState & {
    amount_requested?: number;
    amount_paid?: number;
    cash_reserve_start_of_year: number,
    cash_reserve_end_of_year?: number,
}