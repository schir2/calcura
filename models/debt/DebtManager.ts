import type {Debt} from "~/types/Debt";
import {DebtPaymentStrategy} from "~/types/Debt";
import type DebtState from "~/types/DebtState";
import {assertDefined} from "~/utils";
import BaseManager from "~/models/common/BaseManager";
import {FundType} from "~/models/plan/PlanManager";

export default class DebtManager extends BaseManager<Debt, DebtState> {

    protected override createInitialState(): DebtState {
        return {
            payment: 0,
            principal_start_of_year: this.config.principal,
            interest_lifetime: 0,
            payment_lifetime: 0,
            principal_end_of_year: undefined,
            interest_amount: undefined,
            processed: false,
        }
    }

    override processImplementation(): void {
        const currentState = this.getCurrentState();
        if (currentState.processed) {
            throw new Error("The current state has already been processed.");
        }
        const paymentRequest = this.calculatePayment(currentState)
        const payment = this.orchestrator.requestFunds(paymentRequest, FundType.Taxed, this.config.payment_minimum)
        this.orchestrator.payDebt(payment, this.config.payment_minimum)

        const principalEndOfYear = currentState.principal_start_of_year - payment;
        const interestAmount = this.calculateInterest(principalEndOfYear)

        const interestLifetime = currentState.interest_lifetime + interestAmount;
        const paymentLifetime = currentState.payment_lifetime + payment;
        const updatedPrincipalEndOfYear = principalEndOfYear + interestAmount;

        this.orchestrator.adjustDebt(updatedPrincipalEndOfYear)
        this.updateCurrentState({
            ...currentState,
            payment: paymentRequest,
            interest_amount: interestAmount,
            interest_lifetime: interestLifetime,
            payment_lifetime: paymentLifetime,
            principal_end_of_year: updatedPrincipalEndOfYear
        })
    }

    calculateInterest(principal: number): number {
        return principal * (this.config.interest_rate / 100);
    }


    calculatePayment(state: DebtState): number {
        return calculateDebtPayment(this.config, state.principal_start_of_year)
    }

    override createNextState(previousState: DebtState): DebtState {
        assertDefined(previousState.principal_end_of_year, 'principalEndOfYear')
        return {
            ...previousState,
            payment: 0,
            principal_start_of_year: previousState.principal_end_of_year,
            principal_end_of_year: undefined,
            interest_amount: undefined,
            processed: false
        };
    }
}

export function calculateDebtPayment(debtConfig: Debt, principal: number): number {
    let payment = 0
    switch (debtConfig.payment_strategy) {
        case DebtPaymentStrategy.Fixed:
            payment = debtConfig.payment_fixed_amount;
            break
        case DebtPaymentStrategy.PercentageOfDebt:
            payment = principal * (debtConfig.payment_percentage / 100);
            break
        case DebtPaymentStrategy.MaximumPayment:
            payment = principal;
            break
        case DebtPaymentStrategy.MinimumPayment:
            payment = debtConfig.payment_minimum
            break
    }
    payment = getAnnualAmount(payment, debtConfig.frequency)
    return Math.min(payment, principal);

}