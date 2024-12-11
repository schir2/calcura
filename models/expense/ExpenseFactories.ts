import {DEFAULT_EXPENSE_AMOUNT, DEFAULT_EXPENSE_FREQUENCY, DEFAULT_EXPENSE_IS_ESSENTIAL, DEFAULT_EXPENSE_IS_TAX_DEDUCTIBLE, DEFAULT_EXPENSE_NAME, DEFAULT_EXPENSE_TYPE} from "~/models/expense/ExpenseConstants";
import type Expense from "~/models/expense/Expense";

export function simpleExpenseFactory(): Expense {
    return {
        name: DEFAULT_EXPENSE_NAME,
        amount: DEFAULT_EXPENSE_AMOUNT,
        type: DEFAULT_EXPENSE_TYPE,
        frequency: DEFAULT_EXPENSE_FREQUENCY,
        isEssential: DEFAULT_EXPENSE_IS_ESSENTIAL,
        isTaxDeductible: DEFAULT_EXPENSE_IS_TAX_DEDUCTIBLE,

    }
}