export type BrokerageContributionStrategy = 'fixed' | 'percentage_of_income' | 'max'

export default interface BrokerageInvestmentConfig {
    name: string;

    growthRate: number;
    initialBalance: number;

    contributionStrategy: BrokerageContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;


}