export type IncomeTaxStrategy = 'simple'

export default interface TaxConfig {
    id?: number;
    taxStrategy: IncomeTaxStrategy
    taxRate: number

}