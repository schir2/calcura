import type {InvestmentPipeline} from "~/interfaces/InvestmentPipeline";
import type Row from "~/models/Row";

export default class TaxableSavingsPipeline implements InvestmentPipeline {

    process(row: Row) {
        assertDefined(row.taxableSavingsEndOfYear, 'taxableSavingsEndOfYear')
        row.taxableSavingsStartOfYear = row.taxableSavingsEndOfYear
        row.taxableContribution = row.calculateTaxableContribution()
        row.taxableGrowthAmount = row.calculateTaxableGrowthAmount()
        row.taxableContributionLifetime += row.taxableContribution
        row.taxableSpending += row.taxableContribution
        row.taxableSavingsEndOfYear = row.calculateTaxableSavingsEndOfYear()
        row.savingsEndOfYear += row.taxableContribution + row.taxableGrowthAmount
        return row

    }
}