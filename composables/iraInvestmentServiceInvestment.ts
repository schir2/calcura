import {createBaseService} from '~/services/baseService';
import type IraInvestment from "~/models/ira/IraInvestment";

export function useIraInvestmentService() {
    const {$api} = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<IraInvestment>($api, 'ira_investments/');
}