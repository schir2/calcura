import {createBaseService} from '~/services/baseService';
import type {BrokerageInvestmentTemplate} from "~/types/BrokerageInvestment";

export function useBrokerageInvestmentTemplateService() {
    return useApi<BrokerageInvestmentTemplate>('brokerage-investment-templates')
}