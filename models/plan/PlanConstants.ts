import {type AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";
import type {InvestmentGrowthApplicationStrategy} from "~/types";

export const DEFAULT_EXPENSE_PLAN_NAME: string = 'Blank Plan'
export const DEFAULT_AGE: number = 30;
export const DEFAULT_YEAR: number = new Date().getFullYear();
export const DEFAULT_INFLATION_RATE = 3
export const DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME: AllowNegativeDisposableIncome = 'none'
export const DEFAULT_INVESTMENT_GROWTH_RATE = 2.5
export const DEFAULT_GROWTH_APPLICATION_STRATEGY: InvestmentGrowthApplicationStrategy = 'start'