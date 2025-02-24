import type {BaseState} from "~/models/common/BaseState";

export default interface IncomeState extends BaseState {
    grossIncome: number;
}