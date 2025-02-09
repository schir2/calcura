import {createBaseService} from '~/services/baseService';
import type {Plan} from "~/models/plan/Plan";


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
    return createBaseService<Plan>('/api/plans/');
}
