import {createBaseService} from '~/services/baseService';
import type {IraInvestmentTemplate} from "~/models/iraInvestment/IraInvestment";

export function useIraInvestmentTemplateService() {
    return createBaseService<IraInvestmentTemplate>('/api/ira-investment-templates/');
}