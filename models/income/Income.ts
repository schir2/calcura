import {Frequency} from "~/types/Frequency";

export type IncomeType = 'ordinary'


export interface Income {
    id: number;
    name: string;
    frequency: Frequency;
    grossIncome: number;
    growthRate: number;
    incomeType: IncomeType;
}

export type IncomePartial = Partial<Omit<Income, 'id'>>

export const incomeDefaults: IncomePartial = {
    name: "Income",
    frequency: Frequency.Annually,
    grossIncome: 0,
    growthRate: 0,
    incomeType: "ordinary",
}