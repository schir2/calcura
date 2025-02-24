import {createBaseService} from '~/services/baseService';
import type {BrokerageInvestment} from "~/types/BrokerageInvestment";

export function useBrokerageInvestmentService() {
    return useApi<BrokerageInvestment>('brokerage-investments')
}