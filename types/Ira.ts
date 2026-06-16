import type {Income} from "~/types/Income";

export enum IraContributionStrategy {
    Fixed = 'fixed',
    PercentageOfIncome = 'percentage_of_income',
    Max = 'max'
}

export interface Ira {
    id: number;
    name: string;
    growth_rate: number;
    initial_balance: number;
    contribution_strategy: IraContributionStrategy;
    contribution_percentage: number;
    contribution_fixed_amount: number;

    income?: Income;
}

export type IraPartial = Partial<Omit<Ira, 'id'>>

export interface IraTemplate extends Ira {
    description: string;
}

export const iraDefaults: IraPartial = {
    name: 'Traditional IRA',
    growth_rate: 6,
    initial_balance: 0,
    contribution_strategy: IraContributionStrategy.Fixed,
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}