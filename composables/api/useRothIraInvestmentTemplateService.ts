import {createBaseService} from '~/services/baseService';
import type {RothIraInvestmentTemplate} from "~/types/RothIraInvestment";

export function useRothIraInvestmentTemplateService() {
    return useApi<RothIraInvestmentTemplate>('roth-ira-investment-templates')
}