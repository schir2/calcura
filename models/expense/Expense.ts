import type {Income} from "~/models/income/Income";

export enum ExpenseType {
    fixed = 'fixed',
    variable = 'variable',
}

export enum Frequency {
    Monthly = 'monthly',
    Weekly = 'weekly',
    Quarterly = 'quarterly',
    Annually = 'annual',
    Biweekly = 'biweekly',
}

export interface Expense {
    id: number;
    name: string,
    amount: number,
    expenseType: ExpenseType,
    frequency: Frequency,
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
    frequency: Frequency.Annually,
    isEssential: true,
    isTaxDeductible: false,
    growsWithInflation: false,
    growthRate: 0,
}