import {createBaseService} from '~/services/baseService';
import type {TaxDeferredInvestment} from "~/types/TaxDeferredInvestment";

export function useTaxDeferredInvestmentService() {
    return useApi<TaxDeferredInvestment>('tax-deferred-investments')
}