import {createBaseService} from '~/services/baseService';
import type {Plan} from "~/models/plan/Plan";
import {ofetch} from "ofetch";

type PlanRelatedModel =
    'Incomes'
    | 'Expenses'
    | 'Cashes'
    | 'IraInvestments'
    | 'TaxDeferredInvestments'
    | 'BrokerageInvestments'

export function usePlanService() {
    const config = useRuntimeConfig();
    const baseService = createBaseService<Plan>(config.public.apiBaseUrl, 'plan/');

    return baseService.extend({
        async addRelatedModel(
            planId: number | string,
            relatedModel: PlanRelatedModel,
            relatedId: number | string
        ): Promise<Plan> {
            return await ofetch(
                `${config.public.apiBaseUrl}plan/${planId}/manage_related_model/`,
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
