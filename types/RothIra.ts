import type {Income} from "~/types/Income";
import type {Enums, TablesInsert, TablesUpdate} from '~/types/database.types'

export type RothIraContributionStrategy = Enums<'roth_ira_contribution_strategy'>

export type RothIra = {
    id: number;
    name: string;

    growth_rate: number;
    initial_balance: number;

    contribution_strategy: RothIraContributionStrategy;
    contribution_percentage: number;
    contribution_fixed_amount: number;

    income?: Income;
}

export type RothIraPartial = Partial<Omit<RothIra, 'id'>>

export type RothIraTemplate = RothIra & {
    description: string;
}

export const rothIraDefaults: RothIraPartial = {
    name: 'Roth IRA',
    growth_rate: 6,
    initial_balance: 0,
    contribution_strategy: 'fixed',
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}

export type RothIraInsert = TablesInsert<'roth_ira'>
export type RothIraUpdate = TablesUpdate<'roth_ira'>