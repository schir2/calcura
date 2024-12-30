import {createBaseService} from '~/services/baseService';
import type {RothIraInvestmentTemplate} from "~/models/rothIraInvestment/RothIraInvestment";

export function useRothIraInvestmentTemplateService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<RothIraInvestmentTemplate>($api, 'rothIra-investment-templates/');
}