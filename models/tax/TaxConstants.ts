import {type IncomeTaxStrategy, type TaxData} from "~/models/tax/TaxConfig";

export const DEFAULT_TAX_RATE = 30;
export const DEFAULT_TAX_STRATEGY: IncomeTaxStrategy = 'simple';

export const MIN_TAX_RATE = 0;
export const MAX_TAX_RATE = 100;

export const TAX_TEMPLATE: Record<string, TaxData> = {
    default: {
        taxRate: DEFAULT_TAX_RATE,
        taxStrategy: DEFAULT_TAX_STRATEGY,
    }
}