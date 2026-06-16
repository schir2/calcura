import type {Income} from "~/types/Income";

export enum EmployerContributionStrategy {
    None = 'none',
    PercentageOfContribution = 'percentage_of_contribution',
    PercentageOfCompensation = 'percentage_of_compensation',
    Fixed = 'fixed',
}

export enum TaxDeferredContributionStrategy {
    None = 'none',
    UntilCompanyMatch = 'until_company_match',
    PercentageOfIncome = 'percentage_of_income',
    Fixed = 'fixed',
    Max = 'max',
}

export interface TaxDeferred {
    id: number;
    name: string;
    income?: Income;

    growth_rate: number;
    initial_balance: number;

    elective_contribution_strategy: TaxDeferredContributionStrategy;
    elective_contribution_percentage: number;
    elective_contribution_fixed_amount: number;

    employer_contribution_strategy: EmployerContributionStrategy;
    employer_contribution_match_percentage: number;
    employer_contribution_fixed_amount: number;
    employer_match_percentage: number;
    employer_match_percentage_limit: number;

}

export type TaxDeferredPartial = Partial<Omit<TaxDeferred, 'id'>>

export interface TaxDeferredTemplate extends TaxDeferred {
    description: string
}

export const taxDeferredDefaults: TaxDeferredPartial = {
    name: '401k',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    elective_contribution_strategy: TaxDeferredContributionStrategy.PercentageOfIncome,
    elective_contribution_percentage: 0,
    elective_contribution_fixed_amount: 0,
    income: undefined,

    employer_contribution_strategy:EmployerContributionStrategy.PercentageOfContribution,
    employer_match_percentage: 0,
    employer_contribution_match_percentage: 100,
    employer_contribution_fixed_amount: 0,
    employer_match_percentage_limit: 0,
}