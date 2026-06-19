import type {Income} from "~/types/Income";
import type {Tables, TablesInsert, TablesUpdate} from '~/types/database.types'

export type RothIra = Tables<'roth_ira'> & { income?: Income }
export type RothIraTemplate = Tables<'roth_ira_template'>

export type RothIraInsert = TablesInsert<'roth_ira'>
export type RothIraUpdate = TablesUpdate<'roth_ira'>

export const rothIraDefaults: RothIraInsert = {
    name: 'Roth IRA',
    growth_rate: 6,
    initial_balance: 0,
    contribution_strategy: 'fixed',
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}