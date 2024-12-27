import type {Income} from "~/models/income/Income";

export enum ExpenseType {
    fixed = 'fixed',
    variable = 'variable',
}

export enum ExpenseFrequency {
    Monthly = 'Monthly',
    Weekly = 'Weekly',
    Quarterly = 'Quarterly',
    Annually = 'Annually',
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
    frequency: ExpenseFrequency.Annually,
    isEssential: true,
    isTaxDeductible: false,
    growsWithInflation: false,
    growthRate: 0,
}