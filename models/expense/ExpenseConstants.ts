import {ExpenseType, ExpenseFrequency} from "~/models/expense/Expense";

export const MIN_EXPENSE_AMOUNT = 0;
export const MAX_EXPENSE_AMOUNT = 1_000_000; // Adjust as needed
export const EXPENSE_NAME_MIN_LENGTH = 3;
export const EXPENSE_NAME_MAX_LENGTH = 100;
export const DEFAULT_EXPENSE_NAME = 'Simple Expense';
export const DEFAULT_EXPENSE_AMOUNT = 0;
export const DEFAULT_EXPENSE_TYPE = ExpenseType.fixed;
export const DEFAULT_EXPENSE_FREQUENCY = ExpenseFrequency.annual;
export const DEFAULT_EXPENSE_IS_ESSENTIAL = true;
export const DEFAULT_EXPENSE_IS_TAX_DEDUCTIBLE = false;