export type IraContributionStrategy = 'fixed' | 'percentage_of_income' | 'max'

export interface IraInvestment {
    id: number;
    name: string;
    isContributionTaxDeferred: boolean;

    growthRate: number;
    initialBalance: number;

    contributionStrategy: IraContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;


}

export type IraInvestmentPartial = Partial<Omit<IraInvestment, 'id'>>

export interface IraInvestmentTemplate extends IraInvestment {
    description: string;
}

export const iraInvestmentDefaults: IraInvestmentPartial = {
    name: 'Roth IRA',
    isContributionTaxDeferred: false,
    growthRate: 0,
    initialBalance: 0,
    contributionStrategy: 'fixed',
    contributionPercentage: 0,
    contributionFixedAmount: 0,
}