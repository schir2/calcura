export enum BrokerageContributionStrategy {
    Fixed = 'fixed',
    PercentageOfIncome = 'percentage_of_income',
    Max = 'max'
}


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

export interface BrokerageTemplate extends Brokerage {
    description: string
}

export const brokerageDefaults: BrokeragePartial = {
    name: 'Brokerage ',
    growth_rate: DEFAULT_GROWTH_RATE,
    initial_balance: 0,
    contribution_strategy: BrokerageContributionStrategy.Fixed,
    contribution_percentage: 0,
    contribution_fixed_amount: 0,
}