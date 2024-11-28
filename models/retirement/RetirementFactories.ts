import {DEFAULT_TAX_RATE, DEFAULT_TAX_STRATEGY} from "~/models/tax/TaxConstants";
import type TaxConfig from "~/models/tax/TaxConfig";

export function defaultTaxFactory(): TaxConfig {
    return {
        taxRate: DEFAULT_TAX_RATE,
        taxStrategy: DEFAULT_TAX_STRATEGY,
    }
}