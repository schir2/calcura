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