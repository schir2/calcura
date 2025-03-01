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
    interestRate: number;
    paymentMinimum: number;
    paymentStrategy: DebtPaymentStrategy;
    paymentFixedAmount: number;
    paymentPercentage: number;
    frequency: Frequency
}

export type DebtPartial = Partial<Omit<Debt, 'id'>>
export interface DebtTemplate extends Debt{
    description: string;
}

export const debtDefaults: DebtPartial = {
    name: 'Debt',
    principal: 0,
    interestRate: 0,
    paymentMinimum: 0,
    paymentStrategy: DebtPaymentStrategy.Fixed,
    paymentFixedAmount: 0,
    paymentPercentage: 0,
    frequency: Frequency.Monthly
}