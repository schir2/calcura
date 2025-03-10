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