import type {Income} from "~/types/Income";

export enum IraContributionStrategy {
    Fixed = 'fixed',
    PercentageOfIncome = 'percentage_of_income',
    Max = 'max'
}

export interface IraInvestment {
    id: number;
    name: string;
    growthRate: number;
    initialBalance: number;
    contributionStrategy: IraContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;

    income?: Income;
}

export type IraInvestmentPartial = Partial<Omit<IraInvestment, 'id'>>

export interface IraInvestmentTemplate extends IraInvestment {
    description: string;
}

export const iraInvestmentDefaults: IraInvestmentPartial = {
    name: 'Traditional IRA',
    growthRate: 0,
    initialBalance: 0,
    contributionStrategy: IraContributionStrategy.Fixed,
    contributionPercentage: 0,
    contributionFixedAmount: 0,
}