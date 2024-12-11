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