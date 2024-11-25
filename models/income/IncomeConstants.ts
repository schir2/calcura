import type {GrowthStrategy} from "~/types";
import type {IncomeData} from "~/models/income/IncomeConfig";
import {IncomeType} from "~/models/income/IncomeConfig";

export const DEFAULT_INCOME_NAME = 'Ordinary Income';
export const DEFAULT_GROSS_INCOME = 37585;
export const DEFAULT_GROWTH_RATE = 1.4;
export const DEFAULT_INCOME_TYPE: IncomeType = IncomeType.Ordinary;

export const DEFAULT_GROWTH_STRATEGY: GrowthStrategy = 'fixed';

export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 32;
export const MIN_GROSS_INCOME = 0;
export const MIN_GROWTH_RATE = 0;
export const MAX_GROWTH_RATE = 100;
export const MIN_TAX_RATE = 0;
export const MAX_TAX_RATE = 100;

export const INCOME_TEMPLATE: Record<string, IncomeData> = {
    default: {
        name: DEFAULT_INCOME_NAME,
        grossIncome: DEFAULT_GROSS_INCOME,
        growthRate: DEFAULT_GROWTH_RATE,
        incomeType: DEFAULT_INCOME_TYPE
    }
}
