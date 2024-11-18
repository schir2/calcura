import type {SelectOption} from "~/components/form/BaseSelect.vue";
import type {TaxDeferredInvestmentData} from "~/models/TaxDeferredInvestment";
import type {EmployerContributionStrategy} from "~/constants/employerContribution";
import {DEFAULT_GROWTH_APPLICATION_STRATEGY} from "~/constants/financial";

export const TAX_DEFERRED_DEFAULT_BALANCE: number = 0
export const TAX_DEFERRED_DEFAULT_YEAR = 2024
export const TAX_DEFERRED_CONTRIBUTION_LIMIT_2024 = 66000
export const TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2024 = 22500
export const TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2024 = 7500
export const TAX_DEFERRED_LIMIT_INFLATION_RATE: number = 2.5
export const TAX_DEFERRED_CATCH_UP_AGE = 50
export const DEFAULT_EMPLOYER_CONTRIBUTES: boolean = true
export const DEFAULT_EMPLOYER_CONTRIBUTION_STRATEGY: EmployerContributionStrategy = 'percentage_of_contribution'
export const DEFAULT_EMPLOYER_COMPENSATION_MATCH_PERCENTAGE: number = 0
export const DEFAULT_EMPLOYER_CONTRIBUTION_FIXED_AMOUNT: number = 0
export const DEFAULT_EMPLOYER_MATCH_PERCENTAGE: number = 100
export const DEFAULT_DAX_DEFERRED_GROWTH_RATE: number = 6
export const DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY: TaxDeferredContributionStrategy = 'none'
export const DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE: number = 0

export const DEFAULT_EMPLOYER_MATCH_PERCENTAGE_LIMIT: number = 3
export const TaxDeferredContributionOptions: Record<string, SelectOption> = {
    none: {label: 'None', value: 'none'},
    until_company_match: {label: 'Contribute Until Company Match Limit is Reached', value: 'until_company_match'},
    percentage_of_income: {label: 'Percentage of Income', value: 'percentage_of_income'},
    fixed: {label: 'Fixed', value: 'fixed'},
    max: {label: 'Max', value: 'max'}
} as const;
export type TaxDeferredContributionStrategy = keyof typeof TaxDeferredContributionOptions;

export const DEFAULT_ELECTIVE_CONTRIBUTION_FIXED_AMOUNT: number = 0
export const DEFAULT_TAX_DEFERRED_INVESTMENT: Record<string, TaxDeferredInvestmentData> = {
    default: {
        name: '401k',

        growthApplicationStrategy: DEFAULT_GROWTH_APPLICATION_STRATEGY,
        growthRate: DEFAULT_DAX_DEFERRED_GROWTH_RATE,
        balance: TAX_DEFERRED_DEFAULT_BALANCE,

        electiveContributionStrategy: DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY,
        electiveContributionPercentage: DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE,
        electiveContributionFixedAmount: 0,

        employerContributes: DEFAULT_EMPLOYER_CONTRIBUTES,
        employerContributionStrategy: DEFAULT_EMPLOYER_CONTRIBUTION_STRATEGY,
        employerMatchPercentage: DEFAULT_EMPLOYER_MATCH_PERCENTAGE,
        employerMatchPercentageLimit: DEFAULT_EMPLOYER_MATCH_PERCENTAGE_LIMIT,
        employerContributionFixedAmount: 0,
        employerCompensationMatchPercentage: 0,

    }
}
