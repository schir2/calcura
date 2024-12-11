import {DEFAULT_DEBT_NAME, DEFAULT_FIXED_PAYMENT, DEFAULT_INTEREST_RATE, DEFAULT_MINIMUM_PAYMENT, DEFAULT_PAYMENT_STRATEGY, DEFAULT_PRINCIPAL} from "~/models/debt/DebtConstants";
import type {DebtPartial} from "~/models/debt/Debt";

export function defaultDebtFactory(): DebtPartial {
    return {
        name: DEFAULT_DEBT_NAME,
        interestRate: DEFAULT_INTEREST_RATE,
        paymentFixedAmount: DEFAULT_FIXED_PAYMENT,
        paymentStrategy: DEFAULT_PAYMENT_STRATEGY,
        paymentMinimum: DEFAULT_MINIMUM_PAYMENT,
        paymentPercentage: DEFAULT_MINIMUM_PAYMENT,
        principal: DEFAULT_PRINCIPAL,
    }
}