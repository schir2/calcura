import {Frequency} from "~/types/Frequency";

export type IncomeType = 'ordinary'


export type Income = {
    id: number;
    name: string;
    frequency: Frequency;
    gross_income: number;
    growth_rate: number;
    income_type: IncomeType;
}

export type IncomePartial = Partial<Omit<Income, 'id'>>

export const incomeDefaults: IncomePartial = {
    name: "Income",
    frequency: Frequency.Annually,
    gross_income: 0,
    growth_rate: 0,
    income_type: "ordinary",
}