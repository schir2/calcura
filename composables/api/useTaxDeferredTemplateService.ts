import {createBaseService} from '~/services/baseService';
import type {TaxDeferredTemplate} from "~/types/TaxDeferred";

export function useTaxDeferredTemplateService() {
    return useApi<TaxDeferredTemplate>('tax-deferred-templates')
}