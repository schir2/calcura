import type {Income} from "~/types/Income";

export enum RothIraContributionStrategy {
    Fixed = 'fixed',
    PercentageOfIncome = 'percentage_of_income',
    Max = 'max'
}

export interface RothIra {
    id: number;
    name: string;

    growthRate: number;
    initialBalance: number;

    contributionStrategy: RothIraContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;

    income?: Income;
}

export type RothIraPartial = Partial<Omit<RothIra, 'id'>>

export interface RothIraTemplate extends RothIra {
    description: string;
}

export const rothIraDefaults: RothIraPartial = {
    name: 'Roth IRA',
    growthRate: 0,
    initialBalance: 0,
    contributionStrategy: RothIraContributionStrategy.Fixed,
    contributionPercentage: 0,
    contributionFixedAmount: 0,
}