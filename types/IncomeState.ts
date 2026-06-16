import type {BaseState} from "~/models/common/BaseState";

export default interface IncomeState extends BaseState {
    gross_income: number;
}