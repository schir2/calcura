import {createBaseService} from '~/services/baseService';
import type {DebtTemplate} from "~/models/debt/Debt";

export function useDebtTemplateService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<DebtTemplate>($api, 'debt-templates/');
}