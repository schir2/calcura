import type {BaseState} from "~/types/BaseState";

export type PlanState = BaseState & {
    age: number;
    year: number;

    gross_income: number;
    taxable_income: number;
    taxed_income: number;
    AGI: number;

    taxable_capital: number;
    taxed_capital: number;
    taxed_withdrawals: number;

    deductions: number;

    elective_limit: number;
    deferred_limit: number;
    ira_limit: number;

    inflation_rate: number;

    /* Contributions */
    tax_deferred_contributions: number;
    taxable_contributions: number;
    tax_exempt_contributions: number;

    tax_deferred_contributions_lifetime: number;
    taxable_contributions_lifetime: number;
    tax_exempt_contributions_lifetime: number;


    /* Savings */
    savings_tax_deferred_start_of_year: number;
    savings_tax_deferred_end_of_year: number;

    savings_tax_exempt_start_of_year: number;
    savings_tax_exempt_end_of_year: number;

    savings_taxable_start_of_year: number;
    savings_taxable_end_of_year: number;

    savings_start_of_year: number;
    savings_end_of_year: number;

    debt_start_of_year: number;
    dept_end_of_year: number;

    debt_payments: number;
    debt_payments_lifetime: number;

    expenses_total: number;
    expenses_paid: number;
    expenses_shortfall: number;

    expenses_total_lifetime: number;
    expenses_paid_lifetime: number;
    expenses_shortfall_lifetime: number;

    cash_reserves_total: number;

    retirement_income_projected: number;
    retirement_income_goal: number;
    retired: boolean;

}