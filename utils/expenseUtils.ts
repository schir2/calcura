import {ExpenseFrequency} from "~/models/expense/Expense";
import type {Expense} from "~/models/expense/Expense";

export function getAnnualExpenseAmount(expense: Expense): number {
    switch (expense.frequency) {
        case ExpenseFrequency.monthly:
            return expense.amount * 12
        case ExpenseFrequency.annual:
            return expense.amount
        case ExpenseFrequency.weekly:
            return expense.amount * 52
        case ExpenseFrequency.quarterly:
            return expense.amount * 4
        case ExpenseFrequency.one_time:
            return expense.amount
    }
}