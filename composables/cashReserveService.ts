import {createBaseService} from '~/services/baseService';
import type {CashReserve} from "~/models/cashReserve/CashReserve";

export function useCashReserveService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<CashReserve>($api, 'cash-reserves/');
}