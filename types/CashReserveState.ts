import type {BaseState} from "~/models/common/BaseState";

export default interface CashReserveState extends BaseState {
    amount_requested?: number;
    amount_paid?: number;
    chas_reserve_start_of_year: number,
    cash_reserve_end_of_year?: number,
}