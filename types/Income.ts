import type {Frequency} from "~/types/Frequency";
import type {TablesInsert, TablesUpdate} from '~/types/database.types'

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
    frequency: 'annual',
    gross_income: 0,
    growth_rate: 0,
    income_type: "ordinary",
}

export type IncomeInsert = TablesInsert<'income'>
export type IncomeUpdate = TablesUpdate<'income'>