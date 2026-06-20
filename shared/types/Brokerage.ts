import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type Brokerage = Tables<'brokerage'>
export type BrokerageTemplate = Tables<'brokerage_template'>

export type BrokerageContributionStrategy = Brokerage['contribution_strategy']

export type BrokerageInsert = TablesInsert<'brokerage'>
export type BrokerageUpdate = TablesUpdate<'brokerage'>