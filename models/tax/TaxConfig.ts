import {TAX_TEMPLATE} from "~/models/tax/TaxConstants";

export type IncomeTaxStrategy = 'simple'

export interface TaxData {
    taxStrategy: IncomeTaxStrategy
    taxRate: number

}

export default class TaxConfig {
    taxStrategy: IncomeTaxStrategy
    taxRate: number

    constructor(taxData: TaxData) {
        this.taxStrategy = taxData.taxStrategy
        this.taxRate = taxData.taxRate
    }

    static defaultValues(template?: keyof typeof TAX_TEMPLATE): TaxData {
        return TAX_TEMPLATE[template ?? 'default']
    }
}