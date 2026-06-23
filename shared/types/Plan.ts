import type {Enums, Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

import type {Debt} from "#shared/types/Debt";
import type {TaxDeferred} from "#shared/types/TaxDeferred";
import type {Income} from "#shared/types/Income";
import type {Expense} from "#shared/types/Expense";
import type {Brokerage} from "#shared/types/Brokerage";
import type {Ira} from "#shared/types/Ira";
import type {CashReserve} from "#shared/types/CashReserve";
import type {RothIra} from "#shared/types/RothIra";
import type {Hsa} from "#shared/types/Hsa";
import type {CommandSequence, CommandSequenceWithRelations} from "#shared/types/CommandSequence";


export type InsufficientFundsStrategy = Enums<'insufficient_funds_strategy'>

export type RetirementStrategy = Enums<'retirement_strategy'>

export type GrowthApplicationStrategy = Enums<'growth_application_strategy'>

export type IncomeTaxStrategy = Enums<'income_tax_strategy'>

export enum ContributionLimitType {
    Ira = 'ira',
    Elective = 'elective',
    Deferred = 'deferred',
    Hsa = 'hsa',
}

export type Plan = Tables<'plan'>

export type PlanWithRelations = Plan & {
    cash_reserves: CashReserve[]
    incomes: Income[]
    expenses: Expense[]
    debts: Debt[]
    tax_deferreds: TaxDeferred[]
    brokerages: Brokerage[]
    iras: Ira[]
    roth_iras: RothIra[]
    hsas: Hsa[]
    command_sequences: CommandSequenceWithRelations[]
}

export type PlanInsert = TablesInsert<'plan'>
export type PlanUpdate = TablesUpdate<'plan'>