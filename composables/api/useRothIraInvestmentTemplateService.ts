import {createBaseService} from '~/services/baseService';
import type {RothIraInvestmentTemplate} from "~/models/rothIraInvestment/RothIraInvestment";

export function useRothIraInvestmentTemplateService() {
    return createBaseService<RothIraInvestmentTemplate>('/api/roth-ira-investment-templates/');
}