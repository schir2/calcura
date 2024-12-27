import {ExpenseFrequency} from "~/models/expense/Expense";
import type {Expense} from "~/models/expense/Expense";

export function getAnnualExpenseAmount(expense: Expense): number {
    switch (expense.frequency) {
        case ExpenseFrequency.Monthly:
            return expense.amount * 12
        case ExpenseFrequency.Annually:
            return expense.amount
        case ExpenseFrequency.Weekly:
            return expense.amount * 52
        case ExpenseFrequency.Quarterly:
            return expense.amount * 4
    }
}