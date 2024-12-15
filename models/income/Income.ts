export type IncomeType = 'ordinary'
export type IncomeFrequency = 'annual' | 'quarterly' | 'monthly' | 'biweekly' | 'weekly'


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
    frequency: "annual",
    grossIncome: 0,
    growthRate: 0,
    incomeType: "ordinary",
}