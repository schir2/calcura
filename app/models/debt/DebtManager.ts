import type {Debt} from "#shared/types/Debt";
import type {DebtState} from "#shared/types/DebtState";
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
            payment_shortfall: 0,
            processed: false,
        }
    }

    override processImplementation(): void {
        const currentState = this.getCurrentState();
        if (currentState.processed) {
            throw new Error("The current state has already been processed.");
        }
        const paymentRequest = this.calculatePayment(currentState)
        const payment = this.orchestrator.requestFunds(paymentRequest, FundType.Taxed)
        this.orchestrator.payDebt(payment)

        // In retirement the unmet payment is funded from savings by the drawdown resolver (which runs
        // after every manager processes, so it applies via applySavingsPayment below).
        const paymentShortfall = this.orchestrator.isRetired() ? Math.max(0, paymentRequest - payment) : 0

        const principalEndOfYear = currentState.principal_start_of_year - payment;
        const interestAmount = this.calculateInterest(principalEndOfYear)

        const interestLifetime = currentState.interest_lifetime + interestAmount;
        const paymentLifetime = currentState.payment_lifetime + payment;
        const updatedPrincipalEndOfYear = principalEndOfYear + interestAmount;

        this.orchestrator.accrueDebtInterest(interestAmount)
        this.orchestrator.adjustDebt(updatedPrincipalEndOfYear)
        this.updateCurrentState({
            ...currentState,
            payment: payment,
            interest_amount: interestAmount,
            interest_lifetime: interestLifetime,
            payment_lifetime: paymentLifetime,
            payment_shortfall: paymentShortfall,
            principal_end_of_year: updatedPrincipalEndOfYear
        })
    }

    // Apply a retirement savings-funded payment (raised by the drawdown resolver) to this debt: pay
    // down principal up to the unmet scheduled payment, and record it. Returns the amount applied.
    // Note: interest for the year was already accrued on the cash-only principal, so a savings-funded
    // payment lands just after that accrual — a minor, conservative interest overstatement.
    applySavingsPayment(amountAvailable: number): number {
        const state = this.getCurrentState()
        const principal = state.principal_end_of_year ?? 0
        const applied = Math.min(amountAvailable, state.payment_shortfall, principal)
        if (applied <= 0) return 0
        this.updateCurrentState({
            ...state,
            payment: state.payment + applied,
            payment_lifetime: state.payment_lifetime + applied,
            payment_shortfall: state.payment_shortfall - applied,
            principal_end_of_year: principal - applied,
        })
        this.orchestrator.adjustDebt(-applied)
        this.orchestrator.recordDebtPayment(applied)
        return applied
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
            payment_shortfall: 0,
            processed: false
        };
    }
}

export function calculateDebtPayment(debtConfig: Debt, principal: number): number {
    let payment = 0
    switch (debtConfig.payment_strategy) {
        case 'fixed':
            payment = debtConfig.payment_fixed_amount ?? 0;
            break
        case 'percentage_of_debt':
            payment = principal * ((debtConfig.payment_percentage ?? 0) / 100);
            break
        case 'maximum_payment':
            payment = principal;
            break
        case 'minimum_payment':
            payment = debtConfig.payment_minimum ?? 0
            break
    }
    payment = getAnnualAmount(payment, debtConfig.frequency)
    return Math.min(payment, principal);

}