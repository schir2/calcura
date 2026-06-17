import type {Income} from "~/types/Income";
import type {Enums, TablesInsert, TablesUpdate} from '~/types/database.types'

export type IraContributionStrategy = Enums<'ira_contribution_strategy'>

export type Ira = {
    id: number;
    name: string;
    growth_rate: number;
    initial_balance: number;
    contribution_strategy: IraContributionStrategy;
    contribution_percentage: number;
    contribution_fixed_amount: number;

    income?: Income;
}

export type IraPartial = Partial<Omit<Ira, 'id'>>

export type IraTemplate = Ira & {
    description: string;
}

export const iraDefaults: IraPartial = {
    name: 'Traditional IRA',
    growth_rate: 6,
    initial_balance: 0,
    contribution_strategy: 'fixed',
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}

export type IraInsert = TablesInsert<'ira'>
export type IraUpdate = TablesUpdate<'ira'>