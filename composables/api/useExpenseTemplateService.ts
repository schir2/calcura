import {createBaseService} from '~/services/baseService';
import type {ExpenseTemplate} from "~/models/expense/Expense";

export function useExpenseTemplateService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<ExpenseTemplate>($api, 'expense-templates/');
}