import {createBaseService} from '~/services/baseService';
import type {ExpenseTemplate} from "~/types/Expense";

export function useExpenseTemplateService() {
    return useApi<ExpenseTemplate>('expense-templates')
}