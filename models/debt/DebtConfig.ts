export type DebtPaymentStrategy = 'fixed' | 'minimum_payment' | 'maximum_payment' | 'percentage_of_debt'

export default interface DebtConfig {
    id?: number;
    name: string;
    principal: number;
    interestRate: number;
    paymentMinimum: number;
    paymentStrategy: DebtPaymentStrategy;
    paymentFixedAmount: number;
    paymentPercentage: number;
}