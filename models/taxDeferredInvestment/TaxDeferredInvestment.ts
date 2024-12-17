import type {Income} from "~/models/income/Income";

export type EmployerContributionStrategy = 'none' | 'percentage_of_contribution' | 'percentage_of_compensation' | 'fixed'
export type TaxDeferredContributionStrategy = 'none' | 'until_company_match' | 'percentage_of_income' | 'fixed' | 'max'

export interface TaxDeferredInvestment {
    id: number;
    name: string;
    income?: Income;

    growthRate: number;
    initialBalance: number;

    electiveContributionStrategy: TaxDeferredContributionStrategy;
    electiveContributionPercentage: number;
    electiveContributionFixedAmount: number;

    employerContributes: boolean;
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
    electiveContributionStrategy: "percentage_of_income",
    electiveContributionPercentage: 0,
    electiveContributionFixedAmount: 0,
    income: undefined,

    employerContributes: false,
    employerContributionStrategy: "percentage_of_contribution",
    employerMatchPercentage: 0,
    employerCompensationMatchPercentage: 100,
    employerContributionFixedAmount: 0,
    employerMatchPercentageLimit: 0,
}