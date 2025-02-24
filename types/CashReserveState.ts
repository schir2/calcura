import type {BaseState} from "~/models/common/BaseState";

export default interface CashReserveState extends BaseState {
    amountRequested?: number;
    amountPaid?: number;
    cashReserveStartOfYear: number,
    cashReserveEndOfYear?: number,
}