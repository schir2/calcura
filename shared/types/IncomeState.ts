import type {BaseState} from "#shared/types/BaseState";

export type IncomeState = BaseState & {
    gross_income: number;
}