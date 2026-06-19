import type {Income} from "~/types/Income";
import type {Tables, TablesInsert, TablesUpdate} from '~/types/database.types'

export type Ira = Tables<'ira'> & { income?: Income }
export type IraTemplate = Tables<'ira_template'>

export type IraContributionStrategy = Tables<'ira'>['contribution_strategy']

export type IraInsert = TablesInsert<'ira'>
export type IraUpdate = TablesUpdate<'ira'>

export const iraDefaults: IraInsert = {
    name: 'Traditional IRA',
    growth_rate: 6,
    initial_balance: 0,
    contribution_strategy: 'fixed',
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}