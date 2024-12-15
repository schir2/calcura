import {createBaseService} from '~/services/baseService';
import type {IncomeTemplate} from "~/models/income/IncomeTemplate";

export function useIncomeTemplateService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<IncomeTemplate>($api, 'income-templates/');
}