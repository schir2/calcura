import {createBaseService} from '~/services/baseService';
import type {IraInvestmentTemplate} from "~/types/IraInvestment";

export function useIraInvestmentTemplateService() {
    return useApi<IraInvestmentTemplate>('ira-investment-templates')
}