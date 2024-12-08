import {createBaseService} from '~/services/baseService';

export function useIncomeService<IncomeConfig>() {
    const config = useRuntimeConfig();
    return createBaseService(config.public.apiBaseUrl, 'income-configs/');
}
