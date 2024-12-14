import {createBaseService} from '~/services/baseService';
import type Income from "~/models/income/Income";

export function useIncomeService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<Income>($api, 'incomes/');
}