import {createBaseService} from '~/services/baseService';
import type Expense from "~/models/expense/Expense";

export function useExpenseService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<Expense>($api, 'expenses/');
}