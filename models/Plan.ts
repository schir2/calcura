import Debt from "~/models/Debt";
import type {TaxDeferredInvestmentData} from "~/models/TaxDeferredInvestment";
import TaxDeferredInvestment from "~/models/TaxDeferredInvestment";
import Income from "~/models/Income";
import type {RetirementData} from "~/models/Retirement";
import Retirement from "~/models/Retirement";
import type {IncomeData} from "@/models/Income"
import type {DebtData} from "~/interfaces/DebtData";
import type {INCOME_TEMPLATE} from "~/constants/income";
import {PLAN_TEMPLATE} from "~/constants/plan";
import {TAX_DEFERRED_INVESTMENT_TEMPLATE} from "~/constants/taxDeferred";
import {DEBT_TEMPLATE} from "~/constants/debt";
import type {CashData} from "~/models/Cash";
import Cash from "~/models/Cash";
import type {ExpensePlanData} from "~/models/ExpensePlan";
import ExpensePlan from "~/models/ExpensePlan";

export interface PlanData {
    name: string;
    retirement: RetirementData
    cash: CashData
    incomes: IncomeData[]
    simpleExpensePlan: ExpensePlanData
    itemizedExpensePlan: ExpensePlanData
    debts: DebtData[]
    taxDeferredInvestments: TaxDeferredInvestmentData[];
}

export default class Plan {
    name: string;
    retirement: Retirement
    cash: Cash
    incomes: Income[]
    simpleExpensePlan: ExpensePlan
    itemizedExpensePlan: ExpensePlanData
    debts: Debt[]
    taxDeferredInvestments: TaxDeferredInvestment[];

    constructor(data: PlanData) {
        this.name = data.name;
        this.retirement = new Retirement(data.retirement)
        this.incomes = data.incomes.map((income) => new Income(income))
        this.simpleExpensePlan = new ExpensePlan(data.simpleExpensePlan)
        this.itemizedExpensePlan = new ExpensePlan(data.itemizedExpensePlan)
        this.cash = new Cash(data.cash)
        this.debts = data.debts.map((debt) => new Debt(debt))
        this.taxDeferredInvestments = data.taxDeferredInvestments.map((taxDeferredInvestment) => new TaxDeferredInvestment(taxDeferredInvestment))
    }

    addIncome(template?: keyof typeof INCOME_TEMPLATE): Income {
        const income = new Income(Income.defaultValues(template ?? 'default'))
        this.incomes.push(income)
        return income
    }

    deleteIncome(index: number) {
        this.incomes.splice(index, 1)
    }

    addTaxDeferredInvestment(template?: keyof typeof TAX_DEFERRED_INVESTMENT_TEMPLATE): TaxDeferredInvestment {
        const taxDeferredInvestment = new TaxDeferredInvestment(TaxDeferredInvestment.defaultValues(template ?? 'default'))
        this.taxDeferredInvestments.push(taxDeferredInvestment)
        return taxDeferredInvestment
    }

    deleteTaxDeferredInvestment(index: number) {
        this.taxDeferredInvestments.splice(index, 1)
    }

    addDebt(template?: keyof typeof DEBT_TEMPLATE): Debt {
        const debt = new Debt(Debt.defaultValues(template ?? 'default'))
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