import {createBaseService} from '~/services/baseService';
import type {RothIraInvestment} from "~/types/RothIraInvestment";

export function useRothIraInvestmentService() {
    return useApi<RothIraInvestment>('roth-ira-investments')
}