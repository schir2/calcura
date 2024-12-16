import {createBaseService} from '~/services/baseService';
import type {IraInvestmentTemplate} from "~/models/iraInvestment/IraInvestment";

export function useIraInvestmentTemplateService() {
    const { $api } = useNuxtApp();
    if (!$api) {
        throw new Error('API service is not available');
    }

    return createBaseService<IraInvestmentTemplate>($api, 'ira-investment-templates/');
}