import {createBaseService} from '~/services/baseService';
import type {TaxDeferredInvestmentTemplate} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

export function useTaxDeferredInvestmentTemplateService() {
    return createBaseService<TaxDeferredInvestmentTemplate>('/api/tax-deferred-investment-templates/');
}