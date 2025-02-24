import {createBaseService} from '~/services/baseService';
import type {IraInvestment} from "~/types/IraInvestment";

export function useIraInvestmentService() {
    return useApi<IraInvestment>('ira-investments')
}