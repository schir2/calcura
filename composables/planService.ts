import {createBaseService} from '~/services/baseService';
import type {Plan} from "~/models/plan/Plan";

export function usePlanService() {
    const config = useRuntimeConfig();
    return createBaseService<Plan>(config.public.apiBaseUrl, 'plan-configs/');
}
