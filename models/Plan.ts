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

export interface PlanData {
    name: string;
    retirement: RetirementData
    incomes: IncomeData[]
    debts: DebtData[]
    taxDeferredInvestments: TaxDeferredInvestmentData[];
}

export default class Plan {
    name: string;
    retirement: Retirement
    incomes: Income[]
    debts: Debt[]
    taxDeferredInvestments: TaxDeferredInvestment[];

    constructor(data: PlanData) {
        this.name = data.name;
        this.retirement = new Retirement(data.retirement)
        this.incomes = data.incomes.map((income) => new Income(income))
        this.debts = data.debts.map((debt) => new Debt(debt))
        this.taxDeferredInvestments = data.taxDeferredInvestments.map((taxDeferredInvestment) => new TaxDeferredInvestment(taxDeferredInvestment))
    }

    addIncome(template?: keyof typeof INCOME_TEMPLATE): Income {
        const income = new Income(Income.defaultValues(template ?? 'default'))
        this.incomes.push(income)
        return income
    }

    deleteIncome(index: number){
        this.incomes.splice(index, 1)
    }

    static defaultValues(template?: keyof typeof PLAN_TEMPLATE): PlanData {
        return PLAN_TEMPLATE[template ?? 'default']
    }
}