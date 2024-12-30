import {createBaseService} from '~/services/baseService';
import type {RothIraInvestment} from "~/models/rothIraInvestment/RothIraInvestment";

export function useRothIraInvestmentService() {
    const {$api} = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<RothIraInvestment>($api, 'roth-ira-investments/');
}