export type ExpenseTrackingStrategy = 'simple' | 'itemized'

export enum ExpenseType {
    fixed = 'fixed',
    variable = 'variable',
}

export enum ExpenseFrequency {
    monthly = 'monthly',
    weekly = 'weekly',
    quarterly = 'quarterly',
    annually = 'annually',
    one_time = 'one_time',
}

export interface Expense {
    id?: number;
    name: string,
    amount: number,
    type: ExpenseType,
    frequency: ExpenseFrequency,
    isEssential: boolean,
    isTaxDeductible: boolean,
}

export type ExpensePartial = Partial<Omit<Expense, 'id'>>