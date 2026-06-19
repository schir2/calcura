import type {Tables, TablesInsert, TablesUpdate} from '~/types/database.types'

export type Expense = Tables<'expense'>
export type ExpenseTemplate = Tables<'expense_template'>

export type ExpenseType = Expense['expense_type']

export type ExpenseInsert = TablesInsert<'expense'>
export type ExpenseUpdate = TablesUpdate<'expense'>

export const expenseDefaults: ExpenseInsert = {
    name: '',
    amount: 0,
    expense_type: 'fixed',
    frequency: 'annual',
    is_essential: true,
    is_tax_deductible: false,
    grows_with_inflation: false,
    growth_rate: 0,
}