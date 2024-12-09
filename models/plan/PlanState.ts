import type {AllowNegativeDisposableIncome} from "~/models/plan/Plan";

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

    retirementIncomeProjected: number,
    retired: boolean,

    savingsStartOfYear: number;
    savingsEndOfYear: number;
    processed: boolean;
}