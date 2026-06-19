import type {Tables, TablesInsert, TablesUpdate} from '~/types/database.types'

export type Income = Tables<'income'>
export type IncomeTemplate = Tables<'income_template'>

export type IncomeType = Income['income_type']

export type IncomeInsert = TablesInsert<'income'>
export type IncomeUpdate = TablesUpdate<'income'>

export const incomeDefaults: IncomeInsert = {
    name: "Income",
    frequency: 'annual',
    gross_income: 0,
    growth_rate: 0,
    income_type: "ordinary",
}