export enum HsaContributionStrategy {
    Fixed = 'fixed',
}

export interface Hsa {
    id: number;
    name: string;
    growthRate: number;
    initialBalance: number;
    contributionStrategy: HsaContributionStrategy;
    contributionFixedAmount: number;
}

export type HsaPartial = Partial<Omit<Hsa, 'id'>>

export const hsaDefaults: HsaPartial = {
    name: 'HSA',
    growthRate: 6,
    initialBalance: 0,
    contributionStrategy: HsaContributionStrategy.Fixed,
    contributionFixedAmount: 0,
}