import type {Income} from "~/types/Income";

export enum IraContributionStrategy {
    Fixed = 'fixed',
    PercentageOfIncome = 'percentage_of_income',
    Max = 'max'
}

export interface Ira {
    id: number;
    name: string;
    growthRate: number;
    initialBalance: number;
    contributionStrategy: IraContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;

    income?: Income;
}

export type IraPartial = Partial<Omit<Ira, 'id'>>

export interface IraTemplate extends Ira {
    description: string;
}

export const iraDefaults: IraPartial = {
    name: 'Traditional IRA',
    growthRate: 6,
    initialBalance: 0,
    contributionStrategy: IraContributionStrategy.Fixed,
    contributionPercentage: 0,
    contributionFixedAmount: 0,
}