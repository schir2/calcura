import {createBaseService} from '~/services/baseService';
import type {BrokerageInvestment} from "~/models/brokerageInvestment/BrokerageInvestment";

export function useBrokerageInvestmentService() {
    return useApi<BrokerageInvestment>('brokerage-investments')
}