export type IraType = 'taxExempt' | 'taxDeferred'
export type IraContributionStrategy = 'fixed' | 'percentage_of_income' | 'max'

export default interface IraInvestmentConfig {
    id?: number;
    name: string;
    iraType: IraType;

    growthRate: number;
    initialBalance: number;

    contributionStrategy: IraContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;


}