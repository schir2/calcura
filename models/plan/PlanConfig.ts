import type DebtConfig from "~/models/debt/DebtConfig";
import type {TaxDeferredInvestmentConfig} from "~/models/taxDeferred/TaxDeferredInvestmentConfig";
import type IncomeConfig from "~/models/income/IncomeConfig";
import type {IncomeTaxStrategy} from "~/models/tax/TaxConfig";
import type ExpenseConfig from "~/models/expense/ExpenseConfig";
import type BrokerageInvestmentConfig from "~/models/brokerage/BrokerageInvestmentConfig";
import type IraInvestmentConfig from "~/models/ira/IraInvestmentConfig";
import type {RetirementStrategy} from "~/types";
import type CashConfig from "~/models/cash/CashConfig";


export type AllowNegativeDisposableIncome = 'none' | 'minimum_only' | 'full'


export interface PlanConfig {
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