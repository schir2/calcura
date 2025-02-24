import type {Debt} from "~/types/Debt";
import type {TaxDeferredInvestment} from "~/types/TaxDeferredInvestment";
import type {Income} from "~/types/Income";
import type {Expense} from "~/types/Expense";
import type {BrokerageInvestment} from "~/types/BrokerageInvestment";
import type {IraInvestment} from "~/types/IraInvestment";
import type {CashReserve} from "~/types/CashReserve";
import type {RothIraInvestment} from "~/types/RothIraInvestment";
import type {CommandSequence} from "~/types/CommandSequence";


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

export type PlanModels = 'taxDeferredInvestment' | 'brokerageInvestment' | 'cashReserve' | 'debt' | 'expense' | 'income' | 'iraInvestment' | 'plan' | 'rothIraInvestment';

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
    commandSequences: CommandSequence[];

}