import type {BaseState} from "~/models/common/BaseState";

type IncomeState = BaseState & {
    gross_income: number;
}

export default IncomeState
