import Row from '../Row';
import {assertDefined} from '~/utils';

export function iraTaxableSavingsPipeline(row: Row): Row {
    assertDefined(row.iraTaxableSavingsEndOfYear, 'iraTaxableSavingsEndOfYear');
    assertDefined(row.incomeDisposable, 'incomeDisposable');
    row.iraTaxableSavingsStartOfYear = row.iraTaxableSavingsEndOfYear;
    row.iraTaxableContribution = row.calculateIraTaxableContribution();
    row.iraTaxableGrowthAmount = row.calculateIraTaxableGrowthAmount();
    row.iraTaxableSavingsEndOfYear = row.calculateIraTaxableSavingsEndOfYear();
    row.iraTaxableContributionLifetime += row.iraTaxableContribution;
    row.savingsEndOfYear += row.iraTaxableContribution + row.iraTaxableGrowthAmount;
    row.incomeDisposable -= row.iraTaxableContribution;
    row.taxableSpending += row.iraTaxableContribution;

    return row;
}
