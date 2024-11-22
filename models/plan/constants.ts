import type {PlanData} from "~/models/plan/PlanConfig";
import RetirementConstants from "~/models/retirement/RetirementConstants";
import IncomeConfig from "~/models/income/IncomeConfig";
import DebtConfig from "~/models/debt/DebtConfig";
import CashConfig from "~/models/cash/CashConfig";
import TaxDeferredInvestmentConfig from "~/models/taxDeferred/TaxDeferredInvestmentConfig";
import ExpensePlanConfig, {ExpensePlanType} from "~/models/expense/ExpensePlanConfig";

export const DEFAULT_EXPENSE_PLAN_NAME: string = 'Blank Plan'
export const DEFAULT_AGE: number = 30;
export const DEFAULT_YEAR: number = new Date().getFullYear();

const DEFAULT_EXPENSE_PLAN_ACTIVE_EXPENSE_PLAN = ExpensePlanType.Simple;

export const PLAN_TEMPLATE: Record<string, PlanData> = {
    default: {
        name: DEFAULT_EXPENSE_PLAN_NAME,
        age: DEFAULT_AGE,
        retirement: new RetirementConstants(RetirementConstants.defaultValues()),
        incomes: [IncomeConfig.defaultValues()],
        simpleExpensePlan: ExpensePlanConfig.defaultValues(),
        itemizedExpensePlan: ExpensePlanConfig.defaultValues('itemized'),
        activeExpensePlan: DEFAULT_EXPENSE_PLAN_ACTIVE_EXPENSE_PLAN,
        cash: new CashConfig(CashConfig.defaultValues()),
        debts: [DebtConfig.defaultValues()],
        taxDeferredInvestments: [TaxDeferredInvestmentConfig.defaultValues()],

    }
}
