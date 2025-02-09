import {createBaseService} from '~/services/baseService';
import type {ExpenseTemplate} from "~/models/expense/Expense";

export function useExpenseTemplateService() {
    return createBaseService<ExpenseTemplate>('/api/expense-templates/');
}