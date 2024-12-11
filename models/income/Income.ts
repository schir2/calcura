export type IncomeType = 'ordinary'


export default interface Income {
    id?: number;
    name: string;
    grossIncome: number;
    growthRate: number;
    incomeType: IncomeType;
}