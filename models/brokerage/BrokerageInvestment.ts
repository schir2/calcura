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