import type {Debt} from "~/types/Debt";
import type {TaxDeferred} from "~/types/TaxDeferred";
import type {Income} from "~/types/Income";
import type {Expense} from "~/types/Expense";
import type {Brokerage} from "~/types/Brokerage";
import type {Ira} from "~/types/Ira";
import type {CashReserve} from "~/types/CashReserve";
import type {RothIra} from "~/types/RothIra";
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

export type PlanModels = 'taxDeferred' | 'brokerage' | 'cashReserve' | 'debt' | 'expense' | 'income' | 'ira' | 'plan' | 'rothIra';

export interface Plan {
    id: number;
    name: string;
    age: number;
    year: number;
    inflationRate: number;
    insufficientFundsStrategy: InsufficientFundsStrategy;
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
    taxDeferreds: TaxDeferred[];
    brokerages: Brokerage[];
    iras: Ira[];
    rothIras: RothIra[];
    commandSequences: CommandSequence[];

}