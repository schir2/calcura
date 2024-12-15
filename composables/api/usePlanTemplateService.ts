import {createBaseService} from '~/services/baseService';
import type {PlanTemplate} from "~/models/plan/PlanTemplate";

export function usePlanTemplateService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<PlanTemplate>($api, 'plan-templates/');
}