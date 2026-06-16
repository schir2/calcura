import type {Income} from "~/types/Income";
import {Frequency} from "~/types/Frequency";

export enum ExpenseType {
    fixed = 'fixed',
    variable = 'variable',
}

export interface Expense {
    id: number;
    name: string,
    amount: number,
    expense_type: ExpenseType,
    frequency: Frequency,
    is_essential: boolean,
    is_tax_deductible: boolean,
    grows_with_inflation: boolean,
    growth_rate: number,
}

export type ExpensePartial = Partial<Omit<Expense, 'id'>>

export interface ExpenseTemplate extends Income {
    description: string
}

export const expenseDefaults: ExpensePartial = {
    name: '',
    amount: 0,
    expense_type: ExpenseType.fixed,
    frequency: Frequency.Annually,
    is_essential: true,
    is_tax_deductible: false,
    grows_with_inflation: false,
    growth_rate: 0,
}