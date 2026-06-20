import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type Income = Tables<'income'>
export type IncomeTemplate = Tables<'income_template'>

export type IncomeType = Income['income_type']

export type IncomeInsert = TablesInsert<'income'>
export type IncomeUpdate = TablesUpdate<'income'>