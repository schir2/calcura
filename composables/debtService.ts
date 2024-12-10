import {createBaseService} from '~/services/baseService';
import type DebtConfig from "~/models/debt/DebtConfig";

export function useDebtService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<DebtConfig>($api, 'debts/');
}