import {createBaseService} from '~/services/baseService';
import type {TaxDeferred} from "~/types/TaxDeferred";

export function useTaxDeferredService() {
    return useApi<TaxDeferred>('tax-deferreds')
}