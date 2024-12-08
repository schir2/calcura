import {createBaseService} from '~/services/baseService';

export function useCashService<CashConfig>() {
    const config = useRuntimeConfig();
    return createBaseService(config.public.apiBaseUrl, 'cash-configs/');
}
