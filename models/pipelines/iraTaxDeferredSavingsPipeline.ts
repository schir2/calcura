import type {InvestmentPipeline} from "~/interfaces/InvestmentPipeline";
import type Row from "~/models/Row";


export function iraTaxDeferredSavingsPipeline(row: Row): Row {
        assertDefined(row.savingsEndOfYear, 'savingsEndOfYear')
        assertDefined(row.incomeTaxable, 'incomeTaxable')
        row.savingsStartOfYear = row.savingsEndOfYear
        row.iraTaxDeferredContribution = row.calculateIraDeferredContribution()
        row.iraTaxDeferredGrowthAmount = row.calculateIraTaxDeferredGrowthAmount()
        row.iraTaxDeferredSavingsEndOfYear = row.calculateIraTaxDeferredSavingsEndOfYear()
        row.iraTaxDeferredContributionLifetime += row.iraTaxDeferredContribution
        row.savingsEndOfYear += row.iraTaxDeferredContribution + row.iraTaxDeferredGrowthAmount
        row.taxDeferredSpending += row.iraTaxDeferredContribution
        row.incomeTaxable -= row.iraTaxDeferredContribution
        return row
    }