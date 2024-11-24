import type {AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";

export default interface PlanState {
    age: number;
    year: number;
    grossIncome: number;
    disposableIncome: number;
    electiveLimit: number;
    deferredLimit: number;
    iraLimit: number;
    inflationRate: number;
    savingsStartOfYear: number;
    endOfYearSavings: number;
    allowNegativeDisposableIncome: AllowNegativeDisposableIncome;
}