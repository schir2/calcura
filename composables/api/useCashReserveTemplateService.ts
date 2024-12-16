import {createBaseService} from '~/services/baseService';
import type {CashReserveTemplate} from "~/models/cashReserve/CashReserve";

export function useCashReserveTemplateService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<CashReserveTemplate>($api, 'cash-reserve-templates/');
}