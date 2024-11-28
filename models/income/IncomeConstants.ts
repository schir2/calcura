import type {GrowthStrategy} from "~/types";
import type {IncomeType} from "~/models/income/IncomeConfig";

export const DEFAULT_INCOME_NAME = 'Ordinary Income';
export const DEFAULT_GROSS_INCOME = 37585;
export const DEFAULT_GROWTH_RATE = 1.4;
export const DEFAULT_INCOME_TYPE: IncomeType = 'ordinary';

export const DEFAULT_GROWTH_STRATEGY: GrowthStrategy = 'fixed';

export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 32;
export const MIN_GROSS_INCOME = 0;
export const MIN_GROWTH_RATE = 0;
export const MAX_GROWTH_RATE = 100;

