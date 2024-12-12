import {createBaseService} from '~/services/baseService';
import type {Plan} from "~/models/plan/Plan";

type PlanRelatedModel =
    'Incomes'
    | 'Expenses'
    | 'CashReserves'
    | 'IraInvestments'
    | 'TaxDeferredInvestments'
    | 'BrokerageInvestments'

export function usePlanService() {
    const {$api} = useNuxtApp();
    const baseService = createBaseService<Plan>($api, 'plans/');

    return baseService.extend({
        async addRelatedModel(
            planId: number | string,
            relatedModel: PlanRelatedModel,
            relatedId: number | string
        ): Promise<Plan> {
            return await $api(
                `plans/${planId}/manage_related_model/`,
                {
                    method: 'POST',
                    body: {
                        related_model: relatedModel,
                        related_id: relatedId,
                        action: 'add',
                    }
                }
            )
        }
    })
}
