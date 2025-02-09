import {createBaseService} from '~/services/baseService';
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";

export function useIraInvestmentService() {
    return createBaseService<IraInvestment>('/api/ira-investments/');
}