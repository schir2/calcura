export type IncomeType = 'ordinary'


export interface Income {
    id?: number;
    name: string;
    grossIncome: number;
    growthRate: number;
    incomeType: IncomeType;
}

export type IncomePartial = Partial<Omit<Income, 'idi'>>