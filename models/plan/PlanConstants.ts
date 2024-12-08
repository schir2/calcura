import {type AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";
import type {InvestmentGrowthApplicationStrategy, RetirementStrategy} from "~/types";
import type {IncomeTaxStrategy} from "~/models/tax/TaxConfig";

export const DEFAULT_EXPENSE_PLAN_NAME: string = 'Blank Plan'
export const DEFAULT_AGE: number = 30;
export const DEFAULT_YEAR: number = new Date().getFullYear();
export const DEFAULT_INFLATION_RATE = 3
export const DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME: AllowNegativeDisposableIncome = 'none'
export const DEFAULT_INVESTMENT_GROWTH_RATE = 2.5
export const DEFAULT_GROWTH_APPLICATION_STRATEGY: InvestmentGrowthApplicationStrategy = 'start'
export const DEFAULT_TAX_STRATEGY: IncomeTaxStrategy = 'simple';
export const MIN_TAX_RATE = 0;
export const MAX_TAX_RATE = 100;
export const DEFAULT_TAX_RATE = 2.5
export const DEFAULT_RETIREMENT_PLAN_STRATEGY: RetirementStrategy = 'age'
export const DEFAULT_RETIREMENT_PLAN_NAME: string = 'Retirement Plan'
export const DEFAULT_RETIREMENT_AGE: number = 65;
export const DEFAULT_RETIREMENT_LIFE_EXPECTANCY = 85;
export const MIN_RETIREMENT_LIFE_EXPECTANCY = 50;
export const MAX_RETIREMENT_LIFE_EXPECTANCY = 120;
export const DEFAULT_RETIREMENT_WITHDRAWAL_RATE = 4;
export const MIN_RETIREMENT_WITHDRAWAL_RATE = 0;
export const MAX_RETIREMENT_WITHDRAWAL_RATE = 10;
export const DEFAULT_RETIREMENT_INCOME_GOAL = 50000;
export const MIN_RETIREMENT_INCOME_GOAL = 10000;
export const MAX_RETIREMENT_INCOME_GOAL = 500000;
export const DEFAULT_RETIREMENT_SAVINGS_AMOUNT = 200000;
export const MAX_RETIREMENT_SAVINGS_AMOUNT = 10000000;
export const MIN_RETIREMENT_AGE_FOR_WITHDRAWAL = 30;
export const MAX_RETIREMENT_AGE_FOR_WITHDRAWAL = 100;