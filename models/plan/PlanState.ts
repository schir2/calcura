import type {AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";

export default interface PlanState {
    age: number;
    year: number;
    grossIncome: number;
    taxableIncome: number;
    taxedIncome: number;
    electiveLimit: number;
    deferredLimit: number;
    iraLimit: number;
    inflationRate: number;
    allowNegativeDisposableIncome: AllowNegativeDisposableIncome;

    savingsStartOfYear: number;
    savingsEndOfYear: number;
}