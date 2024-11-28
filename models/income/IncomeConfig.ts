export type IncomeType = 'ordinary'


export default interface IncomeConfig {
    name: string
    grossIncome: number;
    growthRate: number;
    incomeType: IncomeType;
}