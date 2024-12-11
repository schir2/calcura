import {DEFAULT_GROSS_INCOME, DEFAULT_GROWTH_RATE, DEFAULT_INCOME_NAME, DEFAULT_INCOME_TYPE} from "~/models/income/IncomeConstants";
import type {Income} from "~/models/income/Income";


export function defaultIncomeFactory(): Income {
    return {
        name: DEFAULT_INCOME_NAME,
        grossIncome: DEFAULT_GROSS_INCOME,
        growthRate: DEFAULT_GROWTH_RATE,
        incomeType: DEFAULT_INCOME_TYPE
    }
}