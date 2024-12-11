import {createBaseService} from '~/services/baseService';
import type Cash from "~/models/cash/Cash";

export function useCashService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<Cash>($api, 'cashs/');
}