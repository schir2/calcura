import {createBaseService} from '~/services/baseService';
import type {Expense} from "~/types/Expense";

export function useExpenseService() {
    return useApi<Expense>('expenses')
}