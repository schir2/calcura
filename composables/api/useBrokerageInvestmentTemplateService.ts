import {createBaseService} from '~/services/baseService';
import type {BrokerageInvestmentTemplate} from "~/models/brokerageInvestment/BrokerageInvestment";

export function useBrokerageInvestmentTemplateService() {
    return createBaseService<BrokerageInvestmentTemplate>('/api/brokerage-investment-templates/');
}