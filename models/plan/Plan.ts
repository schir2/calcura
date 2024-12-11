import type Debt from "~/models/debt/Debt";
import type {TaxDeferredInvestment} from "~/models/taxDeferred/TaxDeferredInvestment";
import type Income from "~/models/income/Income";
import type Expense from "~/models/expense/Expense";
import type BrokerageInvestment from "~/models/brokerage/BrokerageInvestment";
import type IraInvestment from "~/models/ira/IraInvestment";
import type Cash from "~/models/cash/Cash";


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

    cashes: Cash[]
    incomes: Income[]
    expenses: Expense[]
    debts: Debt[]
    taxDeferredInvestments: TaxDeferredInvestment[];
    brokerageInvestments: BrokerageInvestment[];
    iraInvestments: IraInvestment[];
}