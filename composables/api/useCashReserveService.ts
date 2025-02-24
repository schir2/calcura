import {createBaseService} from '~/services/baseService';
import type {CashReserve} from "~/types/CashReserve";

export function useCashReserveService() {
    return useApi<CashReserve>('cash-reserves')
}