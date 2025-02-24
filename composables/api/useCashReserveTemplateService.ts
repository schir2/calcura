import {createBaseService} from '~/services/baseService';
import type {CashReserveTemplate} from "~/types/CashReserve";

export function useCashReserveTemplateService() {
    return useApi<CashReserveTemplate>('cash-reserve-templates')
}