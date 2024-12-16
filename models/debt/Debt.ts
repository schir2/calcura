export type DebtPaymentStrategy = 'fixed' | 'minimum_payment' | 'maximum_payment' | 'percentage_of_debt'

export interface Debt {
    id: number;
    name: string;
    principal: number;
    interestRate: number;
    paymentMinimum: number;
    paymentStrategy: DebtPaymentStrategy;
    paymentFixedAmount: number;
    paymentPercentage: number;
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
    paymentStrategy: 'fixed',
    paymentFixedAmount: 0,
    paymentPercentage: 0,
}