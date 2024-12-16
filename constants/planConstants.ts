import type {AllowNegativeDisposableIncome, GrowthApplicationStrategy} from "~/models/plan/Plan";

export const DEFAULT_GROWTH_RATE = 6

export const MIN_TAX_RATE = 0;
export const MAX_TAX_RATE = 100;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 32;
export const MIN_RETIREMENT_LIFE_EXPECTANCY = 50;
export const MAX_RETIREMENT_LIFE_EXPECTANCY = 120;
export const MIN_RETIREMENT_WITHDRAWAL_RATE = 0;
export const MAX_RETIREMENT_WITHDRAWAL_RATE = 10;
export const MIN_RETIREMENT_INCOME_GOAL = 10000;
export const MAX_RETIREMENT_INCOME_GOAL = 500000;
export const MAX_RETIREMENT_SAVINGS_AMOUNT = 10000000;
export const MIN_RETIREMENT_AGE_FOR_WITHDRAWAL = 30;
export const MAX_RETIREMENT_AGE_FOR_WITHDRAWAL = 100;
export const MIN_AGE = 1
export const MAX_AGE = 120

export const DEFAULT_AGE: number = 30;
export const DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME: AllowNegativeDisposableIncome = 'none'
export const DEFAULT_GROWTH_APPLICATION_STRATEGY: GrowthApplicationStrategy = 'start'
