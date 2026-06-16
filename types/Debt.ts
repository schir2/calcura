import {Frequency} from "~/types/Frequency";

export enum DebtPaymentStrategy {
    Fixed = 'fixed',
    MinimumPayment = 'minimum_payment',
    MaximumPayment = 'maximum_payment',
    PercentageOfDebt = 'percentage_of_debt',
}


export interface Debt {
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
export interface DebtTemplate extends Debt{
    description: string;
}

export const debtDefaults: DebtPartial = {
    name: 'Debt',
    principal: 0,
    interest_rate: 0,
    payment_minimum: 0,
    payment_strategy: DebtPaymentStrategy.Fixed,
    payment_fixed_amount: 0,
    payment_percentage: 0,
    frequency: Frequency.Monthly
}