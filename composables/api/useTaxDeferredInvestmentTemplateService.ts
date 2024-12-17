import {createBaseService} from '~/services/baseService';
import type {TaxDeferredInvestmentTemplate} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

export function useTaxDeferredInvestmentTemplateService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<TaxDeferredInvestmentTemplate>($api, 'tax-deferred-investment-templates/');
}