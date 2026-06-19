import type {BaseState} from "~/types/BaseState";

export type IncomeState = BaseState & {
    gross_income: number;
}
