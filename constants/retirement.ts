import type {RetirementData} from "~/models/Retirement";

export const DEFAULT_RETIREMENT_PLAN_NAME: string = 'Retirement Plan'

export const DEFAULT_RETIREMENT_AGE: number = 30;
export const DEFAULT_RETIRE_AT_AGE: number = 65;
export const MIN_RETIREMENT_AGE: number = 1;
export const MAX_RETIREMENT_AGE: number = 120;

export const DEFAULT_RETIREMENT_YEAR: number = new Date().getFullYear();
export const MIN_RETIREMENT_YEAR: number = 1900;
export const MAX_RETIREMENT_YEAR: number = 2100;

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

export const RETIREMENT_TEMPLATE: Record<string, RetirementData> = {
    default: {
        name: 'Retire by a Certain Age',
        retirementStrategy: 'age',
        year: DEFAULT_RETIREMENT_YEAR,
        age: DEFAULT_RETIREMENT_AGE,
        retirementAge: DEFAULT_RETIRE_AT_AGE,
        lifeExpectancy: DEFAULT_RETIREMENT_LIFE_EXPECTANCY,
        retirementSavingsAmount: 0,
        retirementWithdrawalRate: 0,
        retirementIncomeGoal: 0,
    }
}
