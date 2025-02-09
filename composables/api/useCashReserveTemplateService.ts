import {createBaseService} from '~/services/baseService';
import type {CashReserveTemplate} from "~/models/cashReserve/CashReserve";

export function useCashReserveTemplateService() {
    return createBaseService<CashReserveTemplate>('/api/cash-reserve-templates/');
}