import {
    DEFAULT_AGE,
    DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME,
    DEFAULT_EXPENSE_PLAN_NAME,
    DEFAULT_INFLATION_RATE,
    DEFAULT_RETIREMENT_AGE,
    DEFAULT_RETIREMENT_LIFE_EXPECTANCY,
    DEFAULT_RETIREMENT_PLAN_STRATEGY, DEFAULT_RETIREMENT_WITHDRAWAL_RATE, DEFAULT_TAX_RATE, DEFAULT_TAX_STRATEGY,
    DEFAULT_YEAR
} from "~/models/plan/PlanConstants";
import type {PlanConfig} from "~/models/plan/PlanConfig";

export function defaultPlanFactory(): PlanConfig {
    return {
        iraInvestments: [],
        lifeExpectancy: DEFAULT_RETIREMENT_LIFE_EXPECTANCY,
        retirementAge: DEFAULT_RETIREMENT_AGE,
        retirementIncomeGoal: 0,
        retirementSavingsAmount: 0,
        retirementStrategy: DEFAULT_RETIREMENT_PLAN_STRATEGY,
        retirementWithdrawalRate: DEFAULT_RETIREMENT_WITHDRAWAL_RATE,
        taxRate: DEFAULT_TAX_RATE,
        taxStrategy: DEFAULT_TAX_STRATEGY,
        name: DEFAULT_EXPENSE_PLAN_NAME,
        age: DEFAULT_AGE,
        year: DEFAULT_YEAR,
        inflationRate: DEFAULT_INFLATION_RATE,
        allowNegativeDisposableIncome: DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME,
        incomes: [],
        expenses: [],
        cashes: [],
        debts: [],
        taxDeferredInvestments: [],
        brokerageInvestments: []

    }
}