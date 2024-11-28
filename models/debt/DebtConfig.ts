export type DebtPaymentStrategy = 'fixed' | 'max' | 'percentage_of_debt'

export default interface DebtConfig {
    name: string;
    principal: number;
    interestRate: number;
    paymentMinimum: number;
    paymentStrategy: DebtPaymentStrategy;
    paymentFixedAmount: number;
    paymentPercentage: number;
}