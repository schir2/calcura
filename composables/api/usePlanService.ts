import {createBaseService} from '~/services/baseService';
import type {Plan} from "~/models/plan/Plan";

const {$api} = useNuxtApp()


type PlanRelatedModel =
    'Incomes'
    | 'Debts'
    | 'Expenses'
    | 'CashReserves'
    | 'IraInvestments'
    | 'TaxDeferredInvestments'
    | 'BrokerageInvestments'
    | 'RothIraInvestments'

export function usePlanService() {
    const baseService = createBaseService<Plan>('/api/plans/');

    return baseService.extend({
        async addRelatedModel(
            planId: number | string,
            relatedModel: PlanRelatedModel,
            relatedId: number | string
        ): Promise<Plan> {
            return await $api(
                `/api/plans/${planId}/manage_related_model/`,
                {
                    method: 'POST',
                    body: {
                        related_model: relatedModel,
                        related_id: relatedId,
                        action: 'add',
                    }
                }
            )
        },
        async removeRelatedModel(
            planId: number | string,
            relatedModel: PlanRelatedModel,
            relatedId: number | string
        ): Promise<Plan> {
            return await $api(
                `/api/plans/${planId}/manage_related_model/`,
                {
                    method: 'POST',
                    body: {
                        related_model: relatedModel,
                        related_id: relatedId,
                        action: 'remove',
                    }
                }
            )
        },
    })
}
