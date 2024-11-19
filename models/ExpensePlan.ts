import Expense, {EXPENSE_TEMPLATE, type ExpenseData} from "~/models/Expense";
import type {INCOME_TEMPLATE} from "~/constants/income";

export enum ExpenseGrowthOption {
    Fixed = 'fixed',
    Inflation = 'inflation',
    PercentageOfIncome = 'percentage_of_income',
    NoGrowth = 'no_growth',
}

export enum ExpensePlanType {
    Simple = 'simple',
    Itemized = 'itemized'
}

export interface ExpensePlanData {
    name: string;
    planType: ExpensePlanType;
    expenses: ExpenseData[];
    growthStrategy: ExpenseGrowthOption
}

const DEFAULT_SIMPLE_EXPENSE_PLAN_NAME = 'Simple Expense Plan';
const DEFAULT_SIMPLE_EXPENSE_PLAN_EXPENSE = EXPENSE_TEMPLATE['simple'];
const DEFAULT_SIMPLE_EXPENSE_PLAN_GROWTH_STRATEGY = ExpenseGrowthOption.Inflation;
export const EXPENSE_PLAN_TEMPLATE: Record<string, ExpensePlanData> = {
    default: {
        name: DEFAULT_SIMPLE_EXPENSE_PLAN_NAME,
        planType: ExpensePlanType.Simple,
        expenses: [DEFAULT_SIMPLE_EXPENSE_PLAN_EXPENSE],
        growthStrategy: DEFAULT_SIMPLE_EXPENSE_PLAN_GROWTH_STRATEGY
    },
    itemized: {
        name: DEFAULT_SIMPLE_EXPENSE_PLAN_NAME,
        planType: ExpensePlanType.Simple,
        expenses: [DEFAULT_SIMPLE_EXPENSE_PLAN_EXPENSE],
        growthStrategy: DEFAULT_SIMPLE_EXPENSE_PLAN_GROWTH_STRATEGY

    }
}

export default class ExpensePlan {
    name: string;
    planType: ExpensePlanType
    expenses: Expense[];
    growthStrategy: ExpenseGrowthOption;

    constructor(data: ExpensePlanData) {
        this.name = data.name
        this.planType = data.planType
        this.expenses = data.expenses.map((expense) => new Expense(expense));
        this.growthStrategy = data.growthStrategy;
    }

    static defaultValues(template?: keyof typeof INCOME_TEMPLATE): ExpensePlanData {
        return EXPENSE_PLAN_TEMPLATE[template ?? 'default']
    }
}