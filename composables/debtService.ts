import {createBaseService} from '~/services/baseService';

export function useDebtService() {
    const config = useRuntimeConfig();
    return createBaseService(config.public.apiBaseUrl, 'debt-configs/');
}
