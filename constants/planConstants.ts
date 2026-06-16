import {
    GrowthApplicationStrategy,
    IncomeTaxStrategy,
    InsufficientFundsStrategy,
    type Plan,
    RetirementStrategy
} from "~/types/Plan";

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
export const MIN_GROWTH_RATE = 0
export const MAX_GROWTH_RATE = 200;

export const DEFAULT_AGE: number = 30;
export const DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME: InsufficientFundsStrategy = InsufficientFundsStrategy.None
export const DEFAULT_GROWTH_APPLICATION_STRATEGY: GrowthApplicationStrategy = GrowthApplicationStrategy.Start

export const planDefaults: Partial<Plan> = {
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    inflation_rate: 3,
    insufficient_funds_strategy: InsufficientFundsStrategy.None,
    growth_application_strategy: GrowthApplicationStrategy.Start,
    tax_strategy: IncomeTaxStrategy.Simple,
    tax_rate: 2.5,
    growthRate: 6.0,
    life_expectancy: 85,
    retirement_strategy: RetirementStrategy.Age,
    retirement_withdrawal_rate: 4,
    retirement_income_goal: 50000,
    retirement_age: 65,
    retirement_savings_amount: 200000,
    cash_reserves: [],
    incomes: [],
    expenses: [],
    debts: [],
    tax_deferreds: [],
    brokerages: [],
    iras: [],
    roth_iras: [],
    command_sequences: [],
};