export enum BrokerageContributionStrategy {
    Fixed = 'fixed',
    PercentageOfIncome = 'percentage_of_income',
    Max = 'max'
}


export interface Brokerage {
    id: number
    name: string;

    growthRate: number;
    initialBalance: number;

    contributionStrategy: BrokerageContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;


}

export type BrokeragePartial = Partial<Omit<Brokerage, 'id'>>

export interface  BrokerageTemplate extends Brokerage {
    description: string
}

export const brokerageDefaults: BrokeragePartial = {
    name: 'Brokerage ',
    growthRate: DEFAULT_GROWTH_RATE,
    initialBalance: 0,
    contributionStrategy: BrokerageContributionStrategy.Fixed,
    contributionPercentage: 0,
    contributionFixedAmount: 0,
}