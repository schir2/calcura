import type Row from "~/models/Row";

export function endOfYearPipeline(row: Row): Row {
    row.incomeTaxable = row.calculateIncomeTaxable()
    row.incomeTaxAmount = row.calculateIncomeTaxAmount(undefined)
    row.incomeTaxed = row.calculateIncomeTaxed()
    row.incomeDisposable = row.calculateIncomeDisposable()
    row.cashEndOfYear = row.calculateCashEndOfYear()

    row.debts.forEach((debt) => {
        const {principalEndOfYear, interestAmount, interestAccrued, paymentLifetime} = debt.calculateEndOfYearValues();

        debt.principalEndOfYear = principalEndOfYear;
        debt.interestAmount = interestAmount;
        debt.interestAccrued = interestAccrued;
        debt.paymentLifetime = paymentLifetime;
    })
    row.debtEndOfYear = row.calculateTotalDebtEndOfYear()
    row.retirementIncomeProjected = row.calculateRetirementIncomeProjected()
    return row
}