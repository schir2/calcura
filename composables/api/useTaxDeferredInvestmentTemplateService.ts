import {createBaseService} from '~/services/baseService';
import type {TaxDeferredInvestmentTemplate} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

export function useTaxDeferredInvestmentTemplateService() {
    return useApi<TaxDeferredInvestmentTemplate>('tax-deferred-investment-templates');
}