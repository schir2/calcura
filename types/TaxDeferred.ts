import type {Income} from "~/types/Income";
import type {Enums, TablesInsert, TablesUpdate} from '~/types/database.types'

export type EmployerContributionStrategy = Enums<'employer_contribution_strategy'>

export type TaxDeferredContributionStrategy = Enums<'tax_deferred_contribution_strategy'>

export type TaxDeferred = {
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

export type TaxDeferredTemplate = TaxDeferred & {
    description: string
}

export const taxDeferredDefaults: TaxDeferredPartial = {
    name: '401k',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    elective_contribution_strategy: 'percentage_of_income',
    elective_contribution_percentage: 0,
    elective_contribution_fixed_amount: 0,
    income: undefined,

    employer_contribution_strategy: 'percentage_of_contribution',
    employer_match_percentage: 0,
    employer_contribution_match_percentage: 100,
    employer_contribution_fixed_amount: 0,
    employer_match_percentage_limit: 0,
}

export type TaxDeferredInsert = TablesInsert<'tax_deferred'>
export type TaxDeferredUpdate = TablesUpdate<'tax_deferred'>