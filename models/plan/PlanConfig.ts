import type DebtConfig from "~/models/debt/DebtConfig";
import TaxDeferredInvestmentConfig from "~/models/taxDeferred/TaxDeferredInvestmentConfig";
import type IncomeConfig from "~/models/income/IncomeConfig";
import type RetirementConfig from "~/models/retirement/RetirementConfig";
import CashConfig from "~/models/cash/CashConfig";
import type TaxConfig from "~/models/tax/TaxConfig";
import type ExpenseConfig, {ExpenseTrackingStrategy} from "~/models/expense/ExpenseConfig";


export type AllowNegativeDisposableIncome = 'none' | 'minimum_only' | 'full'


export default interface PlanConfig {
    name: string;
    age: number;
    year: number;
    inflationRate: number;
    allowNegativeDisposableIncome: AllowNegativeDisposableIncome

    retirement: RetirementConfig
    cash: CashConfig
    tax: TaxConfig
    incomes: IncomeConfig[]
    expenses: ExpenseConfig[]
    ExpenseTrackingStrategy: ExpenseTrackingStrategy
    debts: DebtConfig[]
    taxDeferredInvestments: TaxDeferredInvestmentConfig[];
}