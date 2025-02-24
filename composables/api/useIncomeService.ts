import {createBaseService} from '~/services/baseService';
import type {Income} from "~/types/Income";

export function useIncomeService() {
    return useApi<Income>('incomes')
}