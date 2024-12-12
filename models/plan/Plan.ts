import type {Debt} from "~/models/debt/Debt";
import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import type {Income} from "~/models/income/Income";
import type {Expense} from "~/models/expense/Expense";
import type {BrokerageInvestment} from "~/models/brokerageInvestment/BrokerageInvestment";
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";
import type {CashReserve} from "~/models/cashReserve/CashReserve";


export type AllowNegativeDisposableIncome = 'none' | 'minimum_only' | 'full'
export type RetirementStrategy = 'debt_free' | 'age' | 'percent_rule' | 'target_savings';
export type GrowthStrategy = 'fixed' | 'percentage_increase';
export type InflationGrowthStrategy = 'fixed' | 'percentage_increase';
export type ExpensesGrowthStrategy = 'fixed' | 'percentage_increase';
export type GrowthApplicationStrategy = 'start' | 'end';
export type IncomeTaxStrategy = 'simple'

export interface Plan {
    id: number;
    name: string;
    age: number;
    year: number;
    inflationRate: number;
    allowNegativeDisposableIncome: AllowNegativeDisposableIncome;
    growthApplicationStrategy: GrowthApplicationStrategy

    taxStrategy: IncomeTaxStrategy
    taxRate: number

    lifeExpectancy: number;
    retirementStrategy: RetirementStrategy;
    retirementWithdrawalRate: number;
    retirementIncomeGoal: number;
    retirementAge: number;
    retirementSavingsAmount: number;

    cashReserves: CashReserve[]
    incomes: Income[]
    expenses: Expense[]
    debts: Debt[]
    taxDeferredInvestments: TaxDeferredInvestment[];
    brokerageInvestments: BrokerageInvestment[];
    iraInvestments: IraInvestment[];
}

export type PlanPartial = Partial<Omit<Plan, 'id'>>