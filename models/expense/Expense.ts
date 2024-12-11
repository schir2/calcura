export type ExpenseTrackingStrategy = 'simple' | 'itemized'

export enum ExpenseType {
    Fixed = 'Fixed',
    Variable = 'Variable',
}

export enum Frequency {
    Monthly = 'Monthly',
    Weekly = 'Weekly',
    Quarterly = 'Quarterly',
    Annually = 'Annually',
    OneTime = 'OneTime',
}

export interface Expense {
    id?: number;
    name: string,
    amount: number,
    type: ExpenseType,
    frequency: Frequency,
    isEssential: boolean,
    isTaxDeductible: boolean,
}