import type {Debt} from "~/models/debt/Debt";
import {DebtPaymentStrategy} from "~/models/debt/Debt";
import type DebtState from "~/models/debt/DebtState";
import {assertDefined} from "~/utils";
import BaseManager from "~/models/common/BaseManager";
import {ProcessDebtCommand} from "~/models/debt/DebtCommands";
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
        const payment = this.orchestrator.requestFunds(paymentRequest, FundType.Taxed)
        this.orchestrator.withdraw(payment, FundType.Taxed)

        const principalEndOfYear = currentState.principalStartOfYear - payment;
        const interestAmount = this.calculateInterest(principalEndOfYear)

        const interestLifetime = currentState.interestLifetime + interestAmount;
        const paymentLifetime = currentState.paymentLifetime + payment;
        const updatedPrincipalEndOfYear = principalEndOfYear + interestAmount;
        this.updateCurrentState({
            ...currentState,
            payment: paymentRequest,
            interestAmount: interestAmount,
            interestLifetime: interestLifetime,
            paymentLifetime: paymentLifetime,
            principalEndOfYear: updatedPrincipalEndOfYear
        })
    }

    calculateInterest(principal: number) : number {
        return principal * (this.config.interestRate / 100);
    }


    calculatePayment(state: DebtState): number {
        let payment = 0
        switch (this.config.paymentStrategy) {
            case DebtPaymentStrategy.Fixed:
                payment = this.config.paymentFixedAmount;
                break
            case DebtPaymentStrategy.PercentageOfDebt:
                payment = this.config.principal * (this.config.paymentPercentage / 100);
                break
            case DebtPaymentStrategy.MaximumPayment:
                payment = state.principalStartOfYear;
                break
            case DebtPaymentStrategy.MinimumPayment:
                payment = this.config.paymentMinimum
                break
        }
        return Math.min(payment, state.principalStartOfYear);

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

    override getCommands(): Command[] {
        return [new ProcessDebtCommand(this)];
    }
}