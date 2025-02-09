import {createBaseService} from '~/services/baseService';
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";

export function useIraInvestmentService() {
    return useApi<IraInvestment>('ira-investments');
}