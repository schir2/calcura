import {createBaseService} from '~/services/baseService';
import type {RothIraInvestment} from "~/models/rothIraInvestment/RothIraInvestment";

export function useRothIraInvestmentService() {
    return createBaseService<RothIraInvestment>('/api/roth-ira-investments/');
}