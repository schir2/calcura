import {createBaseService} from '~/services/baseService';
import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

export function useTaxDeferredInvestmentService() {
    return useApi<TaxDeferredInvestment>('tax-deferred-investments');
}