import type {Tables, TablesInsert, TablesUpdate} from '~/types/database.types'

export type Brokerage = Tables<'brokerage'>
export type BrokerageTemplate = Tables<'brokerage_template'>

export type BrokerageContributionStrategy = Brokerage['contribution_strategy']

export type BrokerageInsert = TablesInsert<'brokerage'>
export type BrokerageUpdate = TablesUpdate<'brokerage'>

export const brokerageDefaults: BrokerageInsert = {
    name: 'Brokerage ',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    contribution_strategy: 'fixed',
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}