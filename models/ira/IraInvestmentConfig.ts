import type {InvestmentGrowthApplicationStrategy} from "~/types";

export type IraType = 'taxExempt' | 'taxDeferred'
export type IraContributionStrategy = 'fixed' | 'percentage_of_income' | 'max'

export default interface IraInvestmentConfig {
    name: string;
    iraType: IraType;
    growthApplicationStrategy: InvestmentGrowthApplicationStrategy;

    growthRate: number;
    initialBalance: number;

    contributionStrategy: IraContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;


}