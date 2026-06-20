import type {BrokerageInsert} from '#shared/types/Brokerage'
import {DEFAULT_GROWTH_RATE} from './shared'

export const brokerageDefaults: BrokerageInsert = {
    name: 'Brokerage',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    contribution_strategy: 'fixed',
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}