import type {Income} from "~/types/Income";
import type {Enums, TablesInsert, TablesUpdate} from '~/types/database.types'
import type {Frequency} from "~/types/Frequency";

export type ExpenseType = Enums<'expense_type'>

export type Expense = {
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

export type ExpenseTemplate = Income & {
    description: string
}

export const expenseDefaults: ExpensePartial = {
    name: '',
    amount: 0,
    expense_type: 'fixed',
    frequency: 'annual',
    is_essential: true,
    is_tax_deductible: false,
    grows_with_inflation: false,
    growth_rate: 0,
}

export type ExpenseInsert = TablesInsert<'expense'>
export type ExpenseUpdate = TablesUpdate<'expense'>
