export type IncomeTaxStrategy = 'simple'

export default interface TaxConfig {
    taxStrategy: IncomeTaxStrategy
    taxRate: number

}