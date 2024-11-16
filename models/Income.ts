import type {GrowthStrategy, IncomeTaxStrategy} from "~/types";


export interface IncomeData {
    name: string
    grossIncome: number;
    growthStrategy: GrowthStrategy;
    growthRate: number;

    taxRate: number;
    taxStrategy: IncomeTaxStrategy;
}

export default class Income {
    name: string
    grossIncome: number;
    growthStrategy: GrowthStrategy;
    growthRate: number;

    taxRate: number;
    taxStrategy: IncomeTaxStrategy;

    constructor(data: IncomeData) {
        this.name = data.name
        this.grossIncome = data.grossIncome
        this.growthStrategy = data.growthStrategy
        this.growthRate = data.growthRate
        this.taxRate = data.taxRate
        this.taxStrategy = data.taxStrategy

    }
}