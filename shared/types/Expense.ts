import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type Expense = Tables<'expense'>
export type ExpenseTemplate = Tables<'expense_template'>

export type ExpenseType = Expense['expense_type']

export type ExpenseInsert = TablesInsert<'expense'>
export type ExpenseUpdate = TablesUpdate<'expense'>