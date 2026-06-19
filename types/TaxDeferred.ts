import type {Income} from "~/types/Income";
import type {Tables, TablesInsert, TablesUpdate} from '~/types/database.types'

export type TaxDeferred = Tables<'tax_deferred'> & { income?: Income }
export type TaxDeferredTemplate = Tables<'tax_deferred_template'>

export type TaxDeferredInsert = TablesInsert<'tax_deferred'>
export type TaxDeferredUpdate = TablesUpdate<'tax_deferred'>

export const taxDeferredDefaults: TaxDeferredInsert = {
    name: '401k',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    elective_contribution_strategy: 'percentage_of_income',
    elective_contribution_percentage: 0,
    elective_contribution_fixed_amount: 0,

    employer_contributes: false,
    employer_contribution_strategy: null,
    employer_match_percentage: 0,
    employer_compensation_match_percentage: 100,
    employer_contribution_fixed_amount: 0,
    employer_match_percentage_limit: 0,
}