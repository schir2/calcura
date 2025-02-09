import {createBaseService} from '~/services/baseService';
import type {BrokerageInvestment} from "~/models/brokerageInvestment/BrokerageInvestment";

export function useBrokerageInvestmentService() {
    return createBaseService<BrokerageInvestment>('/api/brokerage-investments/');
}