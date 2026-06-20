import type {ExpenseInsert} from '#shared/types/Expense'

export const MIN_EXPENSE_AMOUNT = 0
export const MAX_EXPENSE_AMOUNT = 1_000_000

export const expenseDefaults: ExpenseInsert = {
    name: 'Simple Expense',
    amount: 0,
    expense_type: 'fixed',
    frequency: 'annual',
    is_essential: true,
    is_tax_deductible: false,
    grows_with_inflation: false,
    growth_rate: 0,
}
