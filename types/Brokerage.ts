import type {Enums, TablesInsert, TablesUpdate} from '~/types/database.types'

export type BrokerageContributionStrategy = Enums<'contribution_strategy'>


export type Brokerage = {
    id: number
    name: string

    growth_rate: number
    initial_balance: number

    contribution_strategy: BrokerageContributionStrategy
    contribution_percentage: number
    contribution_fixed_amount: number


}

export type BrokeragePartial = Partial<Omit<Brokerage, 'id'>>

export type BrokerageTemplate = Brokerage & {
    description: string
}

export const brokerageDefaults: BrokeragePartial = {
    name: 'Brokerage ',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    contribution_strategy: 'fixed',
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}

export type BrokerageInsert = TablesInsert<'brokerage'>
export type BrokerageUpdate = TablesUpdate<'brokerage'>