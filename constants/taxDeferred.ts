import type {SelectOption} from "~/components/form/Select.vue";

export const TaxDeferredContributionOptions: Record<string, SelectOption> = {
    none: {label: 'None', value: 'none'},
    until_company_match: {label: 'Contribute Until Company Match Limit is Reached', value: 'until_company_match'},
    percentage_of_income: {label: 'Percentage of Income', value: 'percentage_of_income'},
    fixed: {label: 'Fixed', value: 'fixed'},
    max: {label: 'Max', value: 'max'}
} as const;

export type TaxDeferredContributionStrategy = keyof typeof TaxDeferredContributionOptions;
export const DEFAULT_DAX_DEFERRED_GROWTH_RATE: number = 6
export const DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY: TaxDeferredContributionStrategy = 'none'
export const DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE: number = 0
export const DEFAULT_ELECTIVE_CONTRIBUTION_FIXED_AMOUNT: number = 0