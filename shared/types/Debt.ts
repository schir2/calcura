import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type Debt = Tables<'debt'>
export type DebtTemplate = Tables<'debt_template'>

export type DebtPaymentStrategy = Debt['payment_strategy']

export type DebtInsert = TablesInsert<'debt'>
export type DebtUpdate = TablesUpdate<'debt'>