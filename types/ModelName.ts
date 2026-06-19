import type {TableName} from "~/types/TableName";

export type ModelName = Extract<TableName,
    'tax_deferred' |
    'brokerage' |
    'cash_reserve' |
    'debt' |
    'expense' |
    'income' |
    'ira' |
    'plan' |
    'roth_ira'>


