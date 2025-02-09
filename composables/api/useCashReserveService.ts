import {createBaseService} from '~/services/baseService';
import type {CashReserve} from "~/models/cashReserve/CashReserve";

export function useCashReserveService() {
    return createBaseService<CashReserve>('/api/cash-reserves/');
}