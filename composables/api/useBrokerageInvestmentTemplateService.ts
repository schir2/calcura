import {createBaseService} from '~/services/baseService';
import type {BrokerageInvestmentTemplate} from "~/models/brokerageInvestment/BrokerageInvestment";

export function useBrokerageInvestmentService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<BrokerageInvestmentTemplate>($api, 'brokerage-investments/');
}