import DebtConfig, {type DebtData} from "~/models/debt/DebtConfig";
import type {TaxDeferredInvestmentConfigData} from "~/models/taxDeferred/TaxDeferredInvestmentConfig";
import TaxDeferredInvestmentConfig from "~/models/taxDeferred/TaxDeferredInvestmentConfig";
import type {IncomeData} from "~/models/income/IncomeConfig"
import IncomeConfig from "~/models/income/IncomeConfig";
import type {RetirementData} from "~/models/retirement/RetirementConstants";
import RetirementConstants from "~/models/retirement/RetirementConstants";
import type {INCOME_TEMPLATE} from "~/models/income/constants";
import {PLAN_TEMPLATE} from "~/models/plan/constants";
import {TAX_DEFERRED_INVESTMENT_TEMPLATE} from "~/models/taxDeferred/TaxDeferredInvestmentConstants";
import {DEBT_TEMPLATE} from "~/models/debt/DebtConstants";
import type {CashData} from "~/models/cash/CashConfig";
import CashConfig from "~/models/cash/CashConfig";
import type {ExpensePlanData} from "~/models/expense/ExpensePlanConfig";
import ExpensePlanConfig, {ExpensePlanType} from "~/models/expense/ExpensePlanConfig";

export interface PlanData {
    name: string;
    age: number;
    retirement: RetirementData
    cash: CashData
    incomes: IncomeData[]
    simpleExpensePlan: ExpensePlanData
    itemizedExpensePlan: ExpensePlanData
    activeExpensePlan: ExpensePlanType
    debts: DebtData[]
    taxDeferredInvestments: TaxDeferredInvestmentConfigData[];
}

export default class PlanConfig {
    name: string;
    age: number;
    retirement: RetirementConstants
    cash: CashConfig
    incomes: IncomeConfig[]
    simpleExpensePlan: ExpensePlanConfig
    itemizedExpensePlan: ExpensePlanConfig
    activeExpensePlan: ExpensePlanType
    debts: DebtConfig[]
    taxDeferredInvestments: TaxDeferredInvestmentConfig[];

    constructor(data: PlanData) {
        this.name = data.name;
        this.age = data.age;
        this.retirement = new RetirementConstants(data.retirement)
        this.incomes = data.incomes.map((income) => new IncomeConfig(income))
        this.simpleExpensePlan = new ExpensePlanConfig(data.simpleExpensePlan)
        this.itemizedExpensePlan = new ExpensePlanConfig(data.itemizedExpensePlan)
        this.activeExpensePlan = data.activeExpensePlan
        this.cash = new CashConfig(data.cash)
        this.debts = data.debts.map((debt) => new DebtConfig(debt))
        this.taxDeferredInvestments = data.taxDeferredInvestments.map((taxDeferredInvestment) => new TaxDeferredInvestmentConfig(taxDeferredInvestment))
    }

    addIncome(template?: keyof typeof INCOME_TEMPLATE): IncomeConfig {
        const income = new IncomeConfig(IncomeConfig.defaultValues(template ?? 'default'))
        this.incomes.push(income)
        return income
    }

    deleteIncome(index: number) {
        this.incomes.splice(index, 1)
    }

    addTaxDeferredInvestment(template?: keyof typeof TAX_DEFERRED_INVESTMENT_TEMPLATE): TaxDeferredInvestmentConfig {
        const taxDeferredInvestment = new TaxDeferredInvestmentConfig(TaxDeferredInvestmentConfig.defaultValues(template ?? 'default'))
        this.taxDeferredInvestments.push(taxDeferredInvestment)
        return taxDeferredInvestment
    }

    deleteTaxDeferredInvestment(index: number) {
        this.taxDeferredInvestments.splice(index, 1)
    }

    addDebt(template?: keyof typeof DEBT_TEMPLATE): DebtConfig {
        const debt = new DebtConfig(DebtConfig.defaultValues(template ?? 'default'))
        this.debts.push(debt)
        return debt
    }

    deleteDebt(index: number) {
        this.debts.splice(index, 1)
    }

    static defaultValues(template?: keyof typeof PLAN_TEMPLATE): PlanData {
        return PLAN_TEMPLATE[template ?? 'default']
    }
}

export enum AllowNegativeDisposableIncome {
    none = 'none',
    minimumOnly = 'minimum_only',
    full = 'full'
}