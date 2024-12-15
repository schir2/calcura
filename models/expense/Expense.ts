import type {Income} from "~/models/income/Income";

export type ExpenseTrackingStrategy = 'simple' | 'itemized'

export enum ExpenseType {
    fixed = 'fixed',
    variable = 'variable',
}

export enum ExpenseFrequency {
    monthly = 'monthly',
    weekly = 'weekly',
    quarterly = 'quarterly',
    annually = 'annually',
    one_time = 'one_time',
}

export interface Expense {
    id?: number;
    name: string,
    amount: number,
    expenseType: ExpenseType,
    frequency: ExpenseFrequency,
    isEssential: boolean,
    isTaxDeductible: boolean,
}

export type ExpensePartial = Partial<Omit<Expense, 'id'>>

export interface ExpenseTemplate extends Income {
    description: string
}

export const expenseDefaults: ExpensePartial = {
    name: 'Expense',
    amount: 0,
    expenseType: ExpenseType.fixed,
    frequency: ExpenseFrequency.annually,
    isEssential: true,
    isTaxDeductible: false,
}