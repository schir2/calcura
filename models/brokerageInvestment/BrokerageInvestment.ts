export type BrokerageContributionStrategy = 'fixed' | 'percentage_of_income' | 'max'

export interface BrokerageInvestment {
    id: number
    name: string;

    growthRate: number;
    initialBalance: number;

    contributionStrategy: BrokerageContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;


}

export type BrokerageInvestmentPartial = Partial<Omit<BrokerageInvestment, 'id'>>

export interface  BrokerageInvestmentTemplate extends BrokerageInvestment {
    description: string
}

export const brokerageInvestmentDefaults: BrokerageInvestmentPartial = {
    name: 'Brokerage Investment',
    growthRate: DEFAULT_GROWTH_RATE,
    initialBalance: 0,
    contributionStrategy: "fixed",
    contributionPercentage: 0,
    contributionFixedAmount: 0,
}