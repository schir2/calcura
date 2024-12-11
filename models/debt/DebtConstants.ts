import type {DebtPaymentStrategy} from "~/models/debt/Debt";

export const DEFAULT_DEBT_NAME: string = "New Debt";
export const DEFAULT_INTEREST_RATE: number = 5;
export const DEFAULT_MINIMUM_PAYMENT: number = 0;
export const DEFAULT_FIXED_PAYMENT: number = 0;
export const DEFAULT_PAYMENT_STRATEGY: DebtPaymentStrategy = 'fixed';
export const DEFAULT_PAYMENT_PERCENTAGE: number = DEFAULT_INTEREST_RATE
export const DEFAULT_PRINCIPAL: number = 0

export const MIN_DEBT_NAME_LENGTH: number = 3;
export const MAX_DEBT_NAME_LENGTH: number = 50;
export const MIN_INTEREST_RATE: number = 0;
export const MAX_INTEREST_RATE: number = 50;
export const MIN_PAYMENT: number = 1;
export const MAX_PAYMENT: number = 1_000_000;