import type {Enums, TablesInsert, TablesUpdate} from '~/types/database.types'
import type {Frequency} from "~/types/Frequency";

export type DebtPaymentStrategy = Enums<'debt_payment_strategy'>


export type Debt = {
    id: number;
    name: string;
    principal: number;
    interest_rate: number;
    payment_minimum: number;
    payment_strategy: DebtPaymentStrategy;
    payment_fixed_amount: number;
    payment_percentage: number;
    frequency: Frequency
}

export type DebtPartial = Partial<Omit<Debt, 'id'>>
export type DebtTemplate = Debt & {
    description: string;
}

export const debtDefaults: DebtPartial = {
    name: 'Debt',
    principal: 0,
    interest_rate: 0,
    payment_minimum: 0,
    payment_strategy: 'fixed',
    payment_fixed_amount: 0,
    payment_percentage: 0,
    frequency: 'monthly'
}

export type DebtInsert = TablesInsert<'debt'>
export type DebtUpdate = TablesUpdate<'debt'>
