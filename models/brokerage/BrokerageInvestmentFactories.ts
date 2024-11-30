import type BrokerageInvestmentConfig from "~/models/brokerage/BrokerageInvestmentConfig";
import {DEFAULT_BROKERAGE_BALANCE, DEFAULT_BROKERAGE_CONTRIBUTION_FIXED_AMOUNT, DEFAULT_BROKERAGE_CONTRIBUTION_PERCENTAGE, DEFAULT_BROKERAGE_CONTRIBUTION_STRATEGY, DEFAULT_BROKERAGE_GROWTH_RATE} from "~/models/brokerage/BrokerageInvestmentConstants";
import {DEFAULT_GROWTH_APPLICATION_STRATEGY} from "~/constants/financial";

export function defaultBrokerageInvestmentFactory(): BrokerageInvestmentConfig {
    return {
        name: 'Brokerage Investment',

        growthRate: DEFAULT_BROKERAGE_GROWTH_RATE,
        growthApplicationStrategy: DEFAULT_GROWTH_APPLICATION_STRATEGY,
        initialBalance: DEFAULT_BROKERAGE_BALANCE,

        contributionStrategy: DEFAULT_BROKERAGE_CONTRIBUTION_STRATEGY,
        contributionPercentage: DEFAULT_BROKERAGE_CONTRIBUTION_PERCENTAGE,
        contributionFixedAmount: DEFAULT_BROKERAGE_CONTRIBUTION_FIXED_AMOUNT,


    }
}
