import type {GrowthApplicationStrategy, IncomeTaxStrategy, Plan, RetirementStrategy} from "#shared/types/Plan";
import {DEFAULT_GROWTH_RATE} from './shared';

export const MIN_TAX_RATE = 0;
export const MAX_TAX_RATE = 100;
export const MIN_CAPITAL_GAINS_RATE = 0;
export const MAX_CAPITAL_GAINS_RATE = 100;
export const DEFAULT_CAPITAL_GAINS_RATE = 15;
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

// Slider soft-caps: a comfortable range, NOT a validation bound. The number input stays
// authoritative and may exceed these (CONTEXT.md → "Workspace input controls").
// Deliberately below the validator max where that max is unusable as a slider range —
// e.g. retirement savings validates to 10M, which no slider can span at a useful step.
export const SLIDER_TAX_RATE_MAX = 50
export const SLIDER_INFLATION_RATE_MAX = 10
export const SLIDER_GROWTH_RATE_MAX = 15
export const SLIDER_RETIREMENT_SAVINGS_MAX = 2_000_000
export const SLIDER_RETIREMENT_INCOME_GOAL_MAX = 250_000
export const SLIDER_YEAR_MIN = 2000
export const SLIDER_YEAR_MAX = 2050

export const DEFAULT_AGE: number = 30;
export const DEFAULT_GROWTH_APPLICATION_STRATEGY: GrowthApplicationStrategy = 'start'

export const planDefaults: Partial<Plan> = {
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    growth_rate: 6.0,
    inflation_rate: 3,
    growth_application_strategy: 'start',
    tax_strategy: 'simple',
    tax_rate: 2.5,
    capital_gains_rate: DEFAULT_CAPITAL_GAINS_RATE,
    life_expectancy: 85,
    retirement_strategy: 'age',
    retirement_withdrawal_rate: 4,
    retirement_income_goal: 50000,
    retirement_age: 65,
    retirement_savings_amount: 200000,
};
