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

const DEFAULT_EXPENSE_NAME = 'Simple Expense';
const DEFAULT_EXPENSE_AMOUNT = 0;
const DEFAULT_EXPENSE_TYPE = ExpenseType.Fixed;
const DEFAULT_EXPENSE_FREQUENCY = Frequency.Annually;
const DEFAULT_EXPENSE_IS_ESSENTIAL = true;
const DEFAULT_EXPENSE_IS_TAX_DEDUCTIBLE = false;
export const EXPENSE_TEMPLATE: Record<string, ExpenseData> = {
    default: {
        name: DEFAULT_EXPENSE_NAME,
        amount: DEFAULT_EXPENSE_AMOUNT,
        type: DEFAULT_EXPENSE_TYPE,
        frequency: DEFAULT_EXPENSE_FREQUENCY,
        isEssential: DEFAULT_EXPENSE_IS_ESSENTIAL,
        isTaxDeductible: DEFAULT_EXPENSE_IS_TAX_DEDUCTIBLE,

    },
    simple: {
        name: 'Simple Expense',
        amount: 0,
        type: ExpenseType.Fixed,
        frequency: Frequency.Annually,
        isEssential: true,
        isTaxDeductible: false,

    }
}

export interface ExpenseData {
    name: string,
    amount: number,
    type: ExpenseType,
    frequency: Frequency,
    isEssential: boolean,
    isTaxDeductible: boolean,
}

export default class ExpenseConfig {
    name: string
    amount: number
    type: ExpenseType
    frequency: Frequency
    isEssential: boolean
    isTaxDeductible: boolean

    constructor(data: ExpenseData) {
        this.name = data.name
        this.amount = data.amount
        this.type = data.type
        this.frequency = data.frequency
        this.isEssential = data.isEssential
        this.isTaxDeductible = data.isTaxDeductible
    }

    static defaultValues(template: keyof typeof EXPENSE_TEMPLATE): ExpenseData {
        return EXPENSE_TEMPLATE[template ?? 'default']
    }

    calculateAnnualExpense(): number {
        const {amount, frequency} = this;
        switch (frequency) {
            case Frequency.Weekly:
                return amount * 52
            case Frequency.Monthly:
                return amount * 12;
            case Frequency.Quarterly:
                return amount * 4;
            case Frequency.Annually:
                return amount;
            case Frequency.OneTime:
                return amount; // Assuming it's within the year
            default:
                return 0;
        }
    }

}