import {createBaseService} from '~/services/baseService';
import type {CashReserve} from "~/models/cashReserve/CashReserve";

export function useCashReserveService() {
    return useApi<CashReserve>('cash-reserves');
}