import type {GrowthStrategy, IncomeTaxStrategy} from "~/types";
import {INCOME_TEMPLATE} from "~/models/income/constants";


export interface IncomeData {
    name: string
    grossIncome: number;
    growthStrategy: GrowthStrategy;
    growthRate: number;
    taxRate: number;
    taxStrategy: IncomeTaxStrategy;
}

export default class IncomeConfig {
    name: string
    grossIncome: number;
    growthStrategy: GrowthStrategy;
    growthRate: number;
    taxRate: number;
    taxStrategy: IncomeTaxStrategy;

    static defaultValues(template?: keyof typeof INCOME_TEMPLATE): IncomeData {
        return INCOME_TEMPLATE[template ?? 'default']
    }

    constructor(data: IncomeData) {
        this.name = data.name
        this.grossIncome = data.grossIncome
        this.growthStrategy = data.growthStrategy
        this.growthRate = data.growthRate
        this.taxRate = data.taxRate
        this.taxStrategy = data.taxStrategy

    }

    toJSON(): IncomeData {
        return {
            name: this.name,
            grossIncome: this.grossIncome,
            growthStrategy: this.growthStrategy,
            growthRate: this.growthRate,
            taxRate: this.taxRate,
            taxStrategy: this.taxStrategy,
        };
    }
}