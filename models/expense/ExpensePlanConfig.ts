import ExpenseConfig, {EXPENSE_TEMPLATE, type ExpenseData} from "~/models/expense/ExpenseConfig";
import type {INCOME_TEMPLATE} from "~/models/income/IncomeConstants";

export type ExpenseGrowthStrategy = 'fixed' | 'inflation' | 'percentage_of_income' | 'no_growth'
export type ExpensePlanType = 'simple' | 'itemized';

export const EXPENSE_PLAN_NAME_MIN_LENGTH = 3;
export const EXPENSE_PLAN_NAME_MAX_LENGTH = 100;
const DEFAULT_SIMPLE_EXPENSE_PLAN_NAME = 'Simple Expense Plan';
const DEFAULT_SIMPLE_EXPENSE_PLAN_EXPENSE = EXPENSE_TEMPLATE['simple'];
const DEFAULT_SIMPLE_EXPENSE_PLAN_GROWTH_STRATEGY = 'inflation';
export const EXPENSE_PLAN_TEMPLATE: Record<string, ExpensePlanData> = {
    default: {
        name: DEFAULT_SIMPLE_EXPENSE_PLAN_NAME,
        planType: 'simple',
        expenses: [DEFAULT_SIMPLE_EXPENSE_PLAN_EXPENSE],
        growthStrategy: DEFAULT_SIMPLE_EXPENSE_PLAN_GROWTH_STRATEGY
    },
    itemized: {
        name: DEFAULT_SIMPLE_EXPENSE_PLAN_NAME,
        planType: 'simple',
        expenses: [DEFAULT_SIMPLE_EXPENSE_PLAN_EXPENSE],
        growthStrategy: DEFAULT_SIMPLE_EXPENSE_PLAN_GROWTH_STRATEGY

    }
}

export interface ExpensePlanData {
    name: string;
    planType: ExpensePlanType;
    expenses: ExpenseData[];
    growthStrategy: ExpenseGrowthStrategy
}

export default class ExpensePlanConfig {
    name: string;
    planType: ExpensePlanType
    expenses: ExpenseConfig[];
    growthStrategy: ExpenseGrowthStrategy;

    constructor(data: ExpensePlanData) {
        this.name = data.name
        this.planType = data.planType
        this.expenses = data.expenses.map((expense) => new ExpenseConfig(expense));
        this.growthStrategy = data.growthStrategy;
    }

    static defaultValues(template?: keyof typeof INCOME_TEMPLATE): ExpensePlanData {
        return EXPENSE_PLAN_TEMPLATE[template ?? 'default']
    }
}