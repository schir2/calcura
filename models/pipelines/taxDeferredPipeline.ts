import type Row from "~/models/Row";

export function taxDeferredPipeline(row: Row): Row {
    assertDefined(row.taxDeferredSavingsEndOfYear, 'taxDeferredSavingsEndOfYear')
    row.taxDeferredSavingsStartOfYear = row.taxDeferredSavingsEndOfYear
    row.taxDeferredContribution = row.calculateTaxDeferredContribution()
    row.taxDeferredGrowthAmount = row.calculateTaxDeferredGrowthAmount()
    row.taxDeferredContributionLifetime += row.taxDeferredContribution
    row.taxDeferredSpending += row.taxDeferredContribution
    row.taxDeferredSavingsEndOfYear = row.calculateTaxDeferredSavingsEndOfYear();
    row.savingsEndOfYear += row.taxDeferredContribution + row.taxDeferredGrowthAmount
    return row;
}
