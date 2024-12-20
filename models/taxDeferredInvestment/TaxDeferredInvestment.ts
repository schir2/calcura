import type {Income} from "~/models/income/Income";

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

export interface TaxDeferredInvestment {
    id: number;
    name: string;
    income?: Income;

    growthRate: number;
    initialBalance: number;

    electiveContributionStrategy: TaxDeferredContributionStrategy;
    electiveContributionPercentage: number;
    electiveContributionFixedAmount: number;

    employerContributionStrategy: EmployerContributionStrategy;
    employerCompensationMatchPercentage: number;
    employerContributionFixedAmount: number;
    employerMatchPercentage: number;
    employerMatchPercentageLimit: number;

}

export type TaxDeferredInvestmentPartial = Partial<Omit<TaxDeferredInvestment, 'id'>>

export interface TaxDeferredInvestmentTemplate extends TaxDeferredInvestment {
    description: string
}

export const taxDeferredInvestmentDefaults: TaxDeferredInvestmentPartial = {
    name: 'Tax Deferred Investment',
    growthRate: DEFAULT_GROWTH_RATE,
    initialBalance: 0,
    electiveContributionStrategy: TaxDeferredContributionStrategy.PercentageOfIncome,
    electiveContributionPercentage: 0,
    electiveContributionFixedAmount: 0,
    income: undefined,

    employerContributionStrategy:EmployerContributionStrategy.PercentageOfContribution,
    employerMatchPercentage: 0,
    employerCompensationMatchPercentage: 100,
    employerContributionFixedAmount: 0,
    employerMatchPercentageLimit: 0,
}