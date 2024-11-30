import type {InvestmentGrowthApplicationStrategy} from "~/types";

export type BrokerageContributionStrategy = 'fixed' | 'percentage_of_income' | 'max'

export default interface BrokerageInvestmentConfig {
    name: string;
    growthApplicationStrategy: InvestmentGrowthApplicationStrategy;

    growthRate: number;
    initialBalance: number;

    contributionStrategy: BrokerageContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;


}