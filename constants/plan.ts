import type {PlanData} from "~/models/Plan";
import Retirement from "~/models/Retirement";
import Income from "~/models/Income";
import Debt from "~/models/Debt";
import Cash from "~/models/Cash";
import TaxDeferredInvestment from "~/models/TaxDeferredInvestment";
import ExpensePlan from "~/models/ExpensePlan";

export const DEFAULT_PLAN_NAME: string = 'Blank Plan'

export const PLAN_TEMPLATE: Record<string, PlanData> = {
    default: {
        name: DEFAULT_PLAN_NAME,
        retirement: new Retirement(Retirement.defaultValues()),
        incomes: [Income.defaultValues()],
        simpleExpensePlan: ExpensePlan.defaultValues(),
        itemizedExpensePlan: ExpensePlan.defaultValues('itemized'),
        cash: new Cash(Cash.defaultValues()),
        debts: [Debt.defaultValues()],
        taxDeferredInvestments: [TaxDeferredInvestment.defaultValues()],

    }
}