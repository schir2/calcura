import type {BaseState} from "~/types/BaseState";

type IncomeState = BaseState & {
    gross_income: number;
}

export default IncomeState
