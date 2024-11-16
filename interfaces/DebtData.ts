import type { DebtPaymentStrategy } from "~/types";

export interface DebtData {
    name: string;
    principal: number;
    interestRate: number;
    minimumPayment: number;
    paymentStrategy: DebtPaymentStrategy;
    paymentFixedAmount: number;
    paymentPercentage: number;
}