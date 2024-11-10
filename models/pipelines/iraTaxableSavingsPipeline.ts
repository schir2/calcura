import type {InvestmentPipeline} from "~/interfaces/InvestmentPipeline";
import type Row from "~/models/Row";


export default class IraTaxableSavingsPipeline implements InvestmentPipeline {

    process(row: Row) {
        assertDefined(row.iraTaxableSavingsEndOfYear,'iraTaxableSavingsEndOfYear')
        row.iraTaxableSavingsStartOfYear = row.iraTaxableSavingsEndOfYear
        row.iraTaxableContribution = row.calculateIraTaxableContribution()
        row.iraTaxableGrowthAmount = row.calculateIraTaxableGrowthAmount()
        row.iraTaxableSavingsEndOfYear = row.calculateIraTaxableSavingsEndOfYear()
        row.iraTaxableContributionLifetime += row.iraTaxableContribution
        row.savingsEndOfYear += row.iraTaxableContribution + row.iraTaxableGrowthAmount
        return row

    }
}