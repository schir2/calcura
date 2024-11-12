import type Row from "~/models/Row";

export function debtPipelineByName(row: Row, debtName: string): Row {
    assertDefined(row.incomeDisposable, 'incomeDisposable')
    const debt = row.debts.find((d) => d.debtName === debtName);
    if (!debt) return row;

    debt.payment = debt.calculatePayment(row.incomeDisposable);

    const {principalEndOfYear, interestAmount, interestAccrued, paymentLifetime} = debt.calculateEndOfYearValues();
    debt.principalEndOfYear = principalEndOfYear;
    debt.interestAmount = interestAmount;
    debt.interestAccrued = interestAccrued;
    debt.paymentLifetime = paymentLifetime;

    row.incomeDisposable = (row.incomeDisposable) - debt.payment;

    return row;
}