import RetirementConfig from "~/models/retirement/RetirementConfig";
import TaxConfig from "~/models/tax/TaxConfig";
import IncomeConfig from "~/models/income/IncomeConfig";
import CashConfig from "~/models/cash/CashConfig";
import DebtConfig from "~/models/debt/DebtConfig";
import TaxDeferredInvestmentConfig from "~/models/taxDeferred/TaxDeferredInvestmentConfig";
import {DEFAULT_AGE, DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME, DEFAULT_EXPENSE_PLAN_NAME, DEFAULT_INFLATION_RATE, DEFAULT_YEAR} from "~/models/plan/PlanConstants";
import type PlanConfig from "~/models/plan/PlanConfig";
import {simpleExpenseFactory} from "~/models/expense/ExpenseFactories";
import {regularIncomeFactory} from "~/models/income/IncomeFactories";
import {simpleTaxFactory} from "~/models/tax/TaxFactories";

export function defaultPlanFactory(): PlanConfig {
    return {
        name: DEFAULT_EXPENSE_PLAN_NAME,
        age: DEFAULT_AGE,
        year: DEFAULT_YEAR,
        inflationRate: DEFAULT_INFLATION_RATE,
        allowNegativeDisposableIncome: DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME,
        retirement: simpleRetirementFacotory(),
        tax: simpleTaxFactory(),
        incomes: [regularIncomeFactory()],
        expenses: [simpleExpenseFactory()]
        activeExpensePlan: DEFAULT_EXPENSE_PLAN_ACTIVE_EXPENSE_PLAN,
        cash: new CashConfig(CashConfig.defaultValues()),
        debts: [DebtConfig.defaultValues()],
        taxDeferredInvestments: [TaxDeferredInvestmentConfig.defaultValues()],

    }
}