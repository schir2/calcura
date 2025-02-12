import {createBaseService} from '~/services/baseService';
import type {IraInvestmentTemplate} from "~/models/iraInvestment/IraInvestment";

export function useIraInvestmentTemplateService() {
    return useApi<IraInvestmentTemplate>('ira-investment-templates')
}