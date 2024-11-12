import type Row from "~/models/Row";

function debtPipelineByName(row: Row, debtName: string): Row {
    const debt = row.debts.find((d) => d.debtName === debtName);
    if (!debt) return row;

    debt.payment = debt.calculatePayment(row.incomeDisposable || 0);

    const {principalEndOfYear, interestAmount, interestAccrued, paymentLifetime} = debt.calculateEndOfYearValues();
    debt.principalEndOfYear = principalEndOfYear;
    debt.interestAmount = interestAmount;
    debt.interestAccrued = interestAccrued;
    debt.paymentLifetime = paymentLifetime;

    row.incomeDisposable = (row.incomeDisposable || 0) - debt.payment;

    return row;
}