import type {PlanData} from "~/models/plan/PlanConfig";
import {type AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";
import RetirementConfig from "~/models/retirement/RetirementConfig";
import IncomeConfig from "~/models/income/IncomeConfig";
import DebtConfig from "~/models/debt/DebtConfig";
import CashConfig from "~/models/cash/CashConfig";
import TaxDeferredInvestmentConfig from "~/models/taxDeferred/TaxDeferredInvestmentConfig";
import ExpensePlanConfig from "~/models/expense/ExpensePlanConfig";
import TaxConfig from "~/models/tax/TaxConfig";

export const DEFAULT_EXPENSE_PLAN_NAME: string = 'Blank Plan'
export const DEFAULT_AGE: number = 30;
export const DEFAULT_YEAR: number = new Date().getFullYear();
export const DEFAULT_INFLATION_RATE = 3
export const DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME: AllowNegativeDisposableIncome = 'none'

const DEFAULT_EXPENSE_PLAN_ACTIVE_EXPENSE_PLAN = 'simple';

export const PLAN_TEMPLATE: Record<string, PlanData> = {
    default: {
        name: DEFAULT_EXPENSE_PLAN_NAME,
        age: DEFAULT_AGE,
        year: DEFAULT_YEAR,
        inflationRate: DEFAULT_INFLATION_RATE,
        allowNegativeDisposableIncome: DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME,
        retirement: new RetirementConfig(RetirementConfig.defaultValues()),
        tax: new TaxConfig(TaxConfig.defaultValues()),
        incomes: [IncomeConfig.defaultValues()],
        simpleExpensePlan: ExpensePlanConfig.defaultValues(),
        itemizedExpensePlan: ExpensePlanConfig.defaultValues('itemized'),
        activeExpensePlan: DEFAULT_EXPENSE_PLAN_ACTIVE_EXPENSE_PLAN,
        cash: new CashConfig(CashConfig.defaultValues()),
        debts: [DebtConfig.defaultValues()],
        taxDeferredInvestments: [TaxDeferredInvestmentConfig.defaultValues()],

    },
}
