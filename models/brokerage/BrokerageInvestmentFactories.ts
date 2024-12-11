import type {BrokerageInvestmentPartial} from "~/models/brokerage/BrokerageInvestment";
import {DEFAULT_BROKERAGE_BALANCE, DEFAULT_BROKERAGE_CONTRIBUTION_FIXED_AMOUNT, DEFAULT_BROKERAGE_CONTRIBUTION_PERCENTAGE, DEFAULT_BROKERAGE_CONTRIBUTION_STRATEGY, DEFAULT_BROKERAGE_GROWTH_RATE} from "~/models/brokerage/BrokerageInvestmentConstants";

export function defaultBrokerageInvestmentFactory(): BrokerageInvestmentPartial {
    return {
        name: 'Brokerage Investment',
        growthRate: DEFAULT_BROKERAGE_GROWTH_RATE,
        initialBalance: DEFAULT_BROKERAGE_BALANCE,

        contributionStrategy: DEFAULT_BROKERAGE_CONTRIBUTION_STRATEGY,
        contributionPercentage: DEFAULT_BROKERAGE_CONTRIBUTION_PERCENTAGE,
        contributionFixedAmount: DEFAULT_BROKERAGE_CONTRIBUTION_FIXED_AMOUNT,


    }
}
