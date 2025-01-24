import type {Debt} from "~/models/debt/Debt";
import type {TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import type {Income} from "~/models/income/Income";
import type {Expense} from "~/models/expense/Expense";
import type {BrokerageInvestment} from "~/models/brokerageInvestment/BrokerageInvestment";
import type {IraInvestment} from "~/models/iraInvestment/IraInvestment";
import type {CashReserve} from "~/models/cashReserve/CashReserve";
import type {RothIraInvestment} from "~/models/rothIraInvestment/RothIraInvestment";


export enum InsufficientFundsStrategy {
    None = 'none',
    MinimumOnly = 'minimum_only',
    Full = 'full',
}

export enum RetirementStrategy {
    DebtFree = 'debt_free',
    Age = 'age',
    PercentRule = 'percent_rule',
    TargetSavings = 'target_savings',
}

export enum GrowthApplicationStrategy {
    Start = 'start',
    End = 'end',
}

export enum IncomeTaxStrategy {
    Simple = 'simple',
}

export enum ContributionLimitType {
    Ira = 'ira',
    Elective = 'elective',
    Deferred = 'deferred',

}

export interface Plan {
    id: number;
    name: string;
    age: number;
    year: number;
    inflationRate: number;
    insufficientFundsStrategy: InsufficientFundsStrategy;
    growthRate: number;
    growthApplicationStrategy: GrowthApplicationStrategy;
    taxStrategy: IncomeTaxStrategy
    taxRate: number
    lifeExpectancy: number;
    retirementStrategy: RetirementStrategy;
    retirementWithdrawalRate: number;
    retirementIncomeGoal: number;
    retirementAge: number;
    retirementSavingsAmount: number;
    retirementIncomeAdjustedForInflation: boolean;
    cashReserves: CashReserve[]
    incomes: Income[]
    expenses: Expense[]
    debts: Debt[]
    taxDeferredInvestments: TaxDeferredInvestment[];
    brokerageInvestments: BrokerageInvestment[];
    iraInvestments: IraInvestment[];
    rothIraInvestments: RothIraInvestment[];
}

export type PlanPartial = Partial<Omit<Plan, 'id'>>

export const planDefaults: PlanPartial = {
    name: "Blank Plan",
    age: 30,
    year: new Date().getFullYear(),
    inflationRate: 3,
    insufficientFundsStrategy: InsufficientFundsStrategy.None,
    growthApplicationStrategy: GrowthApplicationStrategy.Start,
    taxStrategy: IncomeTaxStrategy.Simple,
    taxRate: 2.5,
    lifeExpectancy: 85,
    retirementStrategy: RetirementStrategy.Age,
    retirementWithdrawalRate: 4,
    retirementIncomeGoal: 50000,
    retirementAge: 65,
    retirementSavingsAmount: 200000,
    cashReserves: [],
    incomes: [],
    expenses: [],
    debts: [],
    taxDeferredInvestments: [],
    brokerageInvestments: [],
    iraInvestments: [],
    rothIraInvestments: [],
};