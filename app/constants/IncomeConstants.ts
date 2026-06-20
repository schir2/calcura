import type {IncomeInsert} from '#shared/types/Income'

export const incomeDefaults: IncomeInsert = {
    name: 'Income',
    frequency: 'annual',
    gross_income: 0,
    growth_rate: 0,
    income_type: 'ordinary',
}