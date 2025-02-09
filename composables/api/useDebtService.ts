import {createBaseService} from '~/services/baseService';
import type {Debt} from "~/models/debt/Debt";

export function useDebtService() {
    return useApi<Debt>('debts');
}