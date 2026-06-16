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
    inflation_rate: number;
    insufficient_funds_strategy: InsufficientFundsStrategy;
    growth_application_strategy: GrowthApplicationStrategy;
    tax_strategy: IncomeTaxStrategy
    tax_rate: number
    life_expectancy: number;
    retirement_strategy: RetirementStrategy;
    retirement_withdrawal_rate: number;
    retirement_income_goal: number;
    retirement_age: number;
    retirement_savings_amount: number;
    retirement_income_adjusted_for_inflation: boolean;
    cash_reserves: CashReserve[]
    incomes: Income[]
    expenses: Expense[]
    debts: Debt[]
    tax_deferreds: TaxDeferred[];
    brokerages: Brokerage[];
    iras: Ira[];
    roth_iras: RothIra[];
    command_sequences: CommandSequence[];
    edited_at: Date
    created_at: Date

}