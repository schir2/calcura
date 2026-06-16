import type {Income} from "~/types/Income";

export enum RothIraContributionStrategy {
    Fixed = 'fixed',
    PercentageOfIncome = 'percentage_of_income',
    Max = 'max'
}

export type RothIra = {
    id: number;
    name: string;

    growth_rate: number;
    initial_balance: number;

    contribution_strategy: RothIraContributionStrategy;
    contribution_percentage: number;
    contribution_fixed_amount: number;

    income?: Income;
}

export type RothIraPartial = Partial<Omit<RothIra, 'id'>>

export type RothIraTemplate = RothIra & {
    description: string;
}

export const rothIraDefaults: RothIraPartial = {
    name: 'Roth IRA',
    growth_rate: 6,
    initial_balance: 0,
    contribution_strategy: RothIraContributionStrategy.Fixed,
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}