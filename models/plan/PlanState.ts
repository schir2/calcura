import type {BaseState} from "~/models/common/BaseState";

export interface PlanState extends BaseState {
    age: number;
    year: number;

    grossIncome: number;
    taxableIncome: number;
    taxedIncome: number;
    AGI: number;

    taxableFunds: number;
    taxedFunds: number;
    taxedWithdrawals: number;

    deductions: number;

    electiveLimit: number;
    deferredLimit: number;
    iraLimit: number;

    inflationRate: number;

    /* Savings */
    savingsTaxDeferredStartOfYear: number;
    savingsTaxDeferredEndOfYear: number;

    savingsTaxExemptStartOfYear: number;
    savingsTaxExemptEndOfYear: number;

    savingsTaxableStartOfYear: number;
    savingsTaxableEndOfYear: number;

    savingsStartOfYear: number;
    savingsEndOfYear: number;

    retirementIncomeProjected: number;
    retired: boolean;

    processed: boolean;
}