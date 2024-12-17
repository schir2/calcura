import type {Income} from "~/models/income/Income";

export enum ExpenseType {
    fixed = 'fixed',
    variable = 'variable',
}

export enum ExpenseFrequency {
    monthly = 'monthly',
    weekly = 'weekly',
    quarterly = 'quarterly',
    annual = 'annual',
    one_time = 'one_time',
}

export interface Expense {
    id: number;
    name: string,
    amount: number,
    expenseType: ExpenseType,
    frequency: ExpenseFrequency,
    isEssential: boolean,
    isTaxDeductible: boolean,
    growsWithInflation: boolean,
    growthRate: number,
}

export type ExpensePartial = Partial<Omit<Expense, 'id'>>

export interface ExpenseTemplate extends Income {
    description: string
}

export const expenseDefaults: ExpensePartial = {
    name: '',
    amount: 0,
    expenseType: ExpenseType.fixed,
    frequency: ExpenseFrequency.annual,
    isEssential: true,
    isTaxDeductible: false,
    growsWithInflation: false,
    growthRate: 0,
}