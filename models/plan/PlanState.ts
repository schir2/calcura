import type {AllowNegativeDisposableIncome, GrowthApplicationStrategy, IncomeTaxStrategy} from "~/models/plan/Plan";

export interface PlanState {
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
    growthApplicationStrategy: GrowthApplicationStrategy;
    taxStrategy: IncomeTaxStrategy;
    taxRate: number;

    retirementIncomeProjected: number;
    retired: boolean;

    savingsStartOfYear: number;
    savingsEndOfYear: number;
    processed: boolean;
}