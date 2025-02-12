import {createBaseService} from '~/services/baseService';
import type {Expense} from "~/models/expense/Expense";

export function useExpenseService() {
    return useApi<Expense>('expenses')
}