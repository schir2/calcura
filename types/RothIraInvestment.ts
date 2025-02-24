import type {Income} from "~/types/Income";

export enum RothIraContributionStrategy {
    Fixed = 'fixed',
    PercentageOfIncome = 'percentage_of_income',
    Max = 'max'
}

export interface RothIraInvestment {
    id: number;
    name: string;

    growthRate: number;
    initialBalance: number;

    contributionStrategy: RothIraContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;

    income?: Income;
}

export type RothIraInvestmentPartial = Partial<Omit<RothIraInvestment, 'id'>>

export interface RothIraInvestmentTemplate extends RothIraInvestment {
    description: string;
}

export const rothIraInvestmentDefaults: RothIraInvestmentPartial = {
    name: 'Roth IRA',
    growthRate: 0,
    initialBalance: 0,
    contributionStrategy: RothIraContributionStrategy.Fixed,
    contributionPercentage: 0,
    contributionFixedAmount: 0,
}