import {createBaseService} from '~/services/baseService';

export function useTaxDeferredInvestmentService<TaxDeferredInvestmentConfig>() {
    const config = useRuntimeConfig();
    return createBaseService(config.public.apiBaseUrl, 'tax-deferred-investment-configs/');
}
