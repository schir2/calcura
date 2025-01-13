export type IncomeType = 'ordinary'
export enum IncomeFrequency {
    Annual = 'annual',
    Quarterly = 'quarterly',
    Monthly = 'monthly',
    Biweekly = 'biweekly',
    Weekly = 'weekly'
}


export interface Income {
    id: number;
    name: string;
    frequency: IncomeFrequency;
    grossIncome: number;
    growthRate: number;
    incomeType: IncomeType;
}

export type IncomePartial = Partial<Omit<Income, 'id'>>

export const incomeDefaults: IncomePartial = {
    name: "Income",
    frequency: IncomeFrequency.Annual,
    grossIncome: 0,
    growthRate: 0,
    incomeType: "ordinary",
}