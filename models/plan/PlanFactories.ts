import {DEFAULT_AGE, DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME, DEFAULT_EXPENSE_PLAN_NAME, DEFAULT_INFLATION_RATE, DEFAULT_YEAR} from "~/models/plan/PlanConstants";
import type PlanConfig from "~/models/plan/PlanConfig";
import {simpleExpenseFactory} from "~/models/expense/ExpenseFactories";
import {defaultIncomeFactory} from "~/models/income/IncomeFactories";
import {simpleTaxFactory} from "~/models/tax/TaxFactories";
import {defaultCashFactory} from "~/models/cash/CashFactories";
import {defaultDebtFactory} from "~/models/debt/DebtFactories";
import {defaultTaxDeferredInvestmentFactory} from "~/models/taxDeferred/TaxDeferredInvestmentFactories";
import {ageRetirementFactory} from "~/models/retirement/RetirementFactories";
import {defaultBrokerageInvestmentFactory} from "~/models/brokerage/BrokerageInvestmentFactories";

export function defaultPlanFactory(): PlanConfig {
    return {
        name: DEFAULT_EXPENSE_PLAN_NAME,
        age: DEFAULT_AGE,
        year: DEFAULT_YEAR,
        inflationRate: DEFAULT_INFLATION_RATE,
        allowNegativeDisposableIncome: DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME,
        retirement: ageRetirementFactory(),
        tax: simpleTaxFactory(),
        incomes: [defaultIncomeFactory()],
        expenses: [simpleExpenseFactory()],
        cash: defaultCashFactory(),
        debts: [defaultDebtFactory()],
        taxDeferredInvestments: [defaultTaxDeferredInvestmentFactory()],
        brokerageInvestments: [defaultBrokerageInvestmentFactory()],

    }
}