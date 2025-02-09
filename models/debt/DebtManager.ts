import type {Debt} from "~/models/debt/Debt";
import {DebtPaymentStrategy} from "~/models/debt/Debt";
import type DebtState from "~/models/debt/DebtState";
import {assertDefined} from "~/utils";
import BaseManager from "~/models/common/BaseManager";
import type Command from "~/models/common/Command";
import {FundType} from "~/models/plan/PlanManager";

export default class DebtManager extends BaseManager<Debt, DebtState> {

    protected override createInitialState(): DebtState {
        return {
            payment: 0,
            principalStartOfYear: this.config.principal,
            interestLifetime: 0,
            paymentLifetime: 0,
            principalEndOfYear: undefined,
            interestAmount: undefined,
            processed: false,
        }
    }

    override processImplementation(): void {
        const currentState = this.getCurrentState();
        if (currentState.processed) {
            throw new Error("The current state has already been processed.");
        }
        const paymentRequest = this.calculatePayment(currentState)
        const payment = this.orchestrator.requestFunds(paymentRequest, FundType.Taxed, this.config.paymentMinimum)
        this.orchestrator.withdraw(payment, FundType.Taxed, this.config.paymentMinimum)
        this.orchestrator.payDebt(payment)

        const principalEndOfYear = currentState.principalStartOfYear - payment;
        const interestAmount = this.calculateInterest(principalEndOfYear)

        const interestLifetime = currentState.interestLifetime + interestAmount;
        const paymentLifetime = currentState.paymentLifetime + payment;
        const updatedPrincipalEndOfYear = principalEndOfYear + interestAmount;

        this.orchestrator.adjustDebt(updatedPrincipalEndOfYear)
        this.updateCurrentState({
            ...currentState,
            payment: paymentRequest,
            interestAmount: interestAmount,
            interestLifetime: interestLifetime,
            paymentLifetime: paymentLifetime,
            principalEndOfYear: updatedPrincipalEndOfYear
        })
    }

    calculateInterest(principal: number): number {
        return principal * (this.config.interestRate / 100);
    }


    calculatePayment(state: DebtState): number {
        return calculateDebtPayment(this.config, state.principalStartOfYear)
    }

    override createNextState(previousState: DebtState): DebtState {
        assertDefined(previousState.principalEndOfYear, 'principalEndOfYear')
        return {
            ...previousState,
            payment: 0,
            principalStartOfYear: previousState.principalEndOfYear,
            principalEndOfYear: undefined,
            interestAmount: undefined,
            processed: false
        };
    }
}

export function calculateDebtPayment(debtConfig: Debt, principal: number): number {
    let payment = 0
    switch (debtConfig.paymentStrategy) {
        case DebtPaymentStrategy.Fixed:
            payment = debtConfig.paymentFixedAmount;
            break
        case DebtPaymentStrategy.PercentageOfDebt:
            payment = debtConfig.principal * (debtConfig.paymentPercentage / 100);
            break
        case DebtPaymentStrategy.MaximumPayment:
            payment = principal;
            break
        case DebtPaymentStrategy.MinimumPayment:
            payment = debtConfig.paymentMinimum * 12
            break
    }
    return Math.min(payment, principal);

}