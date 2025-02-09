import {createBaseService} from '~/services/baseService';
import type {Income} from "~/models/income/Income";

export function useIncomeService() {
    return createBaseService<Income>('/api/incomes/');
}