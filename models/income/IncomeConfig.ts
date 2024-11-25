import {INCOME_TEMPLATE} from "~/models/income/IncomeConstants";

export type IncomeType = 'ordinary'


export interface IncomeData {
    name: string
    grossIncome: number;
    growthRate: number;
    incomeType: IncomeType;
}

export default class IncomeConfig {
    name: string
    grossIncome: number;
    growthRate: number;
    incomeType: IncomeType;

    static defaultValues(template?: keyof typeof INCOME_TEMPLATE): IncomeData {
        return INCOME_TEMPLATE[template ?? 'default']
    }

    constructor(data: IncomeData) {
        this.name = data.name
        this.grossIncome = data.grossIncome
        this.growthRate = data.growthRate
        this.incomeType = data.incomeType

    }
}