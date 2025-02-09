import {createBaseService} from '~/services/baseService';
import type {PlanTemplate} from "~/models/plan/PlanTemplate";

export function usePlanTemplateService() {
    return useApi<PlanTemplate>('plan-templates');
}