import type {BaseState} from "~/models/common/BaseState";

export interface PlanState extends BaseState {
    age: number;
    year: number;

    grossIncome: number;
    taxableIncome: number;
    taxedIncome: number;
    AGI: number;

    taxableCapital: number;
    taxedCapital: number;
    taxedWithdrawals: number;

    deductions: number;

    electiveLimit: number;
    deferredLimit: number;
    iraLimit: number;

    inflationRate: number;

    /* Contributions */
    taxDeferredContributions: number;
    taxableContributions: number;
    taxExemptContributions: number;

    taxDeferredContributionsLifetime: number;
    taxableContributionsLifetime: number;
    taxExemptContributionsLifetime: number;


    /* Savings */
    savingsTaxDeferredStartOfYear: number;
    savingsTaxDeferredEndOfYear: number;

    savingsTaxExemptStartOfYear: number;
    savingsTaxExemptEndOfYear: number;

    savingsTaxableStartOfYear: number;
    savingsTaxableEndOfYear: number;

    savingsStartOfYear: number;
    savingsEndOfYear: number;

    debtStartOfYear: number;
    debtEndOfYear: number;

    debtPayments: number;
    debtPaymentsLifetime: number;

    expensesTotal: number;
    expensesPaid: number;
    expensesShortfall: number;

    expensesTotalLifetime: number;
    expensesPaidLifetime: number;
    expensesShortfallLifetime: number;

    cashReservesTotal: number;

    retirementIncomeProjected: number;
    retirementIncomeGoal: number;
    retired: boolean;

    processed: boolean;
}