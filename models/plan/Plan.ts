import type DebtConfig from "~/models/debt/DebtConfig";
import type {TaxDeferredInvestmentConfig} from "~/models/taxDeferred/TaxDeferredInvestmentConfig";
import type IncomeConfig from "~/models/income/IncomeConfig";
import type ExpenseConfig from "~/models/expense/ExpenseConfig";
import type BrokerageInvestmentConfig from "~/models/brokerage/BrokerageInvestmentConfig";
import type IraInvestmentConfig from "~/models/ira/IraInvestmentConfig";
import type CashConfig from "~/models/cash/CashConfig";


export type AllowNegativeDisposableIncome = 'none' | 'minimum_only' | 'full'
export type RetirementStrategy = 'debt_free' | 'age' | 'percent_rule' | 'target_savings';
export type GrowthStrategy = 'fixed' | 'percentage_increase';
export type InflationGrowthStrategy = 'fixed' | 'percentage_increase';
export type ExpensesGrowthStrategy = 'fixed' | 'percentage_increase';
export type InvestmentGrowthApplicationStrategy = 'start' | 'end';
export type IncomeTaxStrategy = 'simple'

export interface Plan {
    id?: number;
    name: string;
    age: number;
    year: number;
    inflationRate: number;
    allowNegativeDisposableIncome: AllowNegativeDisposableIncome

    taxStrategy: IncomeTaxStrategy
    taxRate: number

    lifeExpectancy: number;
    retirementStrategy: RetirementStrategy;
    retirementWithdrawalRate: number;
    retirementIncomeGoal: number;
    retirementAge: number;
    retirementSavingsAmount: number;

    cashes: CashConfig[]
    incomes: IncomeConfig[]
    expenses: ExpenseConfig[]
    debts: DebtConfig[]
    taxDeferredInvestments: TaxDeferredInvestmentConfig[];
    brokerageInvestments: BrokerageInvestmentConfig[];
    iraInvestments: IraInvestmentConfig[];
}