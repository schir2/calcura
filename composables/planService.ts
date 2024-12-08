import {createBaseService} from '~/services/baseService';

export function usePlanService<PlanConfig>() {
    const config = useRuntimeConfig();
    return createBaseService(config.public.apiBaseUrl, 'plan-configs/');
}
