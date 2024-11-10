import type {InvestmentPipeline} from "~/interfaces/InvestmentPipeline";
import type Row from "~/models/Row";

export default class TaxDeferredEmployerPipeline implements InvestmentPipeline {

    process(row: Row) {
        assertDefined(row.taxDeferredSavingsEndOfYear, 'taxDeferredSavingsEndOfYear')
        row.taxDeferredSavingsStartOfYear = row.taxDeferredSavingsEndOfYear
        row.employerContribution = row.calculateEmployerContribution();
        row.employerContributionLifetime += row.employerContribution
        row.employerGrowthAmount = row.calculateEmployerGrowthAmount()
        row.employerSavingsEndOfYear = row.calculateEmployerSavingsEndOfYear();
        row.savingsEndOfYear += row.employerContribution + row.employerGrowthAmount
        return row;
    }
}