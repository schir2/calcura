import type {PlanData} from "~/models/Plan";
import Retirement from "~/models/Retirement";

export const DEFAULT_PLAN_NAME: string = 'Blank Plan'

export const PLAN_TEMPLATE: Record<string, PlanData> = {
    default: {
        name: DEFAULT_PLAN_NAME,
        retirement: new Retirement(Retirement.defaultValues()),
        incomes: [],
        debts: [],
        taxDeferredInvestments: [],

    }
}