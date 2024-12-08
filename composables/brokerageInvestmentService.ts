import {createBaseService} from '~/services/baseService';

export function useBrokerageInvestmentServiceService<BrokerageInvestmentServiceConfig>() {
    const config = useRuntimeConfig();
    return createBaseService(config.public.apiBaseUrl, 'brokerage-investment-configs/');
}
