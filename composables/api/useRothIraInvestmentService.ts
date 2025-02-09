import {createBaseService} from '~/services/baseService';
import type {RothIraInvestment} from "~/models/rothIraInvestment/RothIraInvestment";

export function useRothIraInvestmentService() {
    return useApi<RothIraInvestment>('roth-ira-investments');
}