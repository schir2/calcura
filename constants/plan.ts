import type {PlanData} from "~/models/Plan";
import Retirement from "~/models/Retirement";
import Income from "~/models/Income";
import Debt from "~/models/Debt";
import Cash from "~/models/Cash";
import TaxDeferredInvestment from "~/models/TaxDeferredInvestment";
import ExpensePlan, {ExpensePlanType} from "~/models/ExpensePlan";

export const DEFAULT_EXPENSE_PLAN_NAME: string = 'Blank Plan'

const DEFAULT_EXPENSE_PLAN_ACTIVE_EXPENSE_PLAN = ExpensePlanType.Simple;

export const PLAN_TEMPLATE: Record<string, PlanData> = {
    default: {
        name: DEFAULT_EXPENSE_PLAN_NAME,
        retirement: new Retirement(Retirement.defaultValues()),
        incomes: [Income.defaultValues()],
        simpleExpensePlan: ExpensePlan.defaultValues(),
        itemizedExpensePlan: ExpensePlan.defaultValues('itemized'),
        activeExpensePlan: DEFAULT_EXPENSE_PLAN_ACTIVE_EXPENSE_PLAN,
        cash: new Cash(Cash.defaultValues()),
        debts: [Debt.defaultValues()],
        taxDeferredInvestments: [TaxDeferredInvestment.defaultValues()],

    }
}