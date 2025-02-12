import {createBaseService} from '~/services/baseService';
import type {CashReserveTemplate} from "~/models/cashReserve/CashReserve";

export function useCashReserveTemplateService() {
    return useApi<CashReserveTemplate>('cash-reserve-templates')
}