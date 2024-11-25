export enum IncomeTaxStrategy {
    Simple = 'simple'
}

export interface TaxData {
    taxStrategy: IncomeTaxStrategy

}

export default class TaxConfig {
    taxStrategy: IncomeTaxStrategy

    constructor(taxData: TaxData) {
        this.taxStrategy = taxData.taxStrategy
    }
}