export type IncomeType = 'ordinary'


export default interface IncomeConfig {
    id?: number;
    name: string;
    grossIncome: number;
    growthRate: number;
    incomeType: IncomeType;
}