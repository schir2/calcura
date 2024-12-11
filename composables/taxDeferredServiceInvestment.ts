import {createBaseService} from '~/services/baseService';
import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

export function useTaxDeferredInvestmentService() {
    const {$api} = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<TaxDeferredInvestment>($api, 'tax-deferred-investments/');
}