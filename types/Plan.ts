import type {Enums, TablesInsert, TablesUpdate} from '~/types/database.types'
import type {Debt} from "~/types/Debt";
import type {TaxDeferred} from "~/types/TaxDeferred";
import type {Income} from "~/types/Income";
import type {Expense} from "~/types/Expense";
import type {Brokerage} from "~/types/Brokerage";
import type {Ira} from "~/types/Ira";
import type {CashReserve} from "~/types/CashReserve";
import type {RothIra} from "~/types/RothIra";
import type {CommandSequence} from "~/types/CommandSequence";


export type InsufficientFundsStrategy = Enums<'insufficient_funds_strategy'>

export type RetirementStrategy = Enums<'retirement_strategy'>

export type GrowthApplicationStrategy = Enums<'growth_application_strategy'>

export type IncomeTaxStrategy = Enums<'income_tax_strategy'>

export enum ContributionLimitType {
    Ira = 'ira',
    Elective = 'elective',
    Deferred = 'deferred',

}

export type PlanModels = 'taxDeferred' | 'brokerage' | 'cashReserve' | 'debt' | 'expense' | 'income' | 'ira' | 'plan' | 'rothIra';

export type Plan = {
    id: number;
    name: string;
    age: number;
    year: number;
    growth_rate: number;
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

export type PlanInsert = TablesInsert<'plan'>
export type PlanUpdate = TablesUpdate<'plan'>