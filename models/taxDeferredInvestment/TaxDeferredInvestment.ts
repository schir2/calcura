export type EmployerContributionStrategy = 'none' | 'percentage_of_contribution' | 'percentage_of_compensation' | 'fixed'
export type TaxDeferredContributionStrategy = 'none' | 'until_company_match' | 'percentage_of_income' | 'fixed' | 'max'

export interface TaxDeferredInvestment {
    id: number;
    name: string;

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