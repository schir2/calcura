import {createBaseService} from '~/services/baseService';
import type Debt from "~/models/debt/Debt";

export function useDebtService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<Debt>($api, 'debts/');
}