import {createBaseService} from '~/services/baseService';
import type {Debt} from "~/types/Debt";

export function useDebtService() {
    return useApi<Debt>('debts')
}