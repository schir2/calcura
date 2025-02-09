import {createBaseService} from '~/services/baseService';
import type {RothIraInvestmentTemplate} from "~/models/rothIraInvestment/RothIraInvestment";

export function useRothIraInvestmentTemplateService() {
    return useApi<RothIraInvestmentTemplate>('roth-ira-investment-templates');
}