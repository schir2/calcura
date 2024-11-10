import type {InvestmentPipeline} from "~/interfaces/InvestmentPipeline";
import type Row from "~/models/Row";

export default class TaxDeferredPipeline implements InvestmentPipeline {

    process(row: Row) {
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
}