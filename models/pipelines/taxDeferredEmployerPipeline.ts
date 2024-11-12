import type Row from "~/models/Row";

export function taxDeferredEmployerPipeline(row: Row): Row {
    assertDefined(row.taxDeferredSavingsEndOfYear, 'taxDeferredSavingsEndOfYear')
    row.taxDeferredSavingsStartOfYear = row.taxDeferredSavingsEndOfYear
    row.employerContribution = row.calculateEmployerContribution();
    row.employerContributionLifetime += row.employerContribution
    row.employerGrowthAmount = row.calculateEmployerGrowthAmount()
    row.employerSavingsEndOfYear = row.calculateEmployerSavingsEndOfYear();
    row.savingsEndOfYear += row.employerContribution + row.employerGrowthAmount
    return row;
}