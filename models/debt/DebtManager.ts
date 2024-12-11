import type Debt from "~/models/debt/Debt";
import type DebtState from "~/models/debt/DebtState";
import {type AllowNegativeDisposableIncome} from "~/models/plan/Plan";
import {adjustForAllowNegativeDisposableIncome, assertDefined} from "~/utils";
import ManagerBase from "~/models/common/ManagerBase";
import type PlanState from "~/models/plan/PlanState";
import {ProcessDebtCommand} from "~/models/debt/DebtCommands";
import type Command from "~/models/common/Command";

export default class DebtManager extends ManagerBase<Debt, DebtState> {

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

    override processImplementation(planState: PlanState): PlanState {
        const currentState = this.getCurrentState();
        if (currentState.processed) {
            throw new Error("The current state has already been processed.");
        }
        const payment = this.calculatePayment(currentState, planState.taxedIncome, planState.allowNegativeDisposableIncome)
        const principalEndOfYear = currentState.principalStartOfYear - payment;
        const interestAmount = principalEndOfYear * (this.config.interestRate / 100);
        const interestLifetime = currentState.interestLifetime + interestAmount;
        const paymentLifetime = currentState.paymentLifetime + currentState.payment;
        const updatedPrincipalEndOfYear = principalEndOfYear + interestAmount;
        this.updateCurrentState({
            ...currentState,
            payment: payment,
            interestAmount: interestAmount,
            interestLifetime: interestLifetime,
            paymentLifetime: paymentLifetime,
            principalEndOfYear: updatedPrincipalEndOfYear
        })
        const updatedDisposableIncome = planState.taxedIncome - payment
        return {
            ...planState,
            taxedIncome: updatedDisposableIncome
        };
    }


    calculatePayment(state: DebtState, disposableIncome: number, allowNegativeDisposableIncome: AllowNegativeDisposableIncome): number {
        let payment = 0
        switch (this.config.paymentStrategy) {
            case 'fixed':
                payment = this.config.paymentFixedAmount;
                break
            case 'percentage_of_debt':
                payment = this.config.principal * (this.config.paymentPercentage / 100);
                break
            case 'max':
                payment = state.principalStartOfYear;
                break
        }
        payment = adjustForAllowNegativeDisposableIncome(
            {
                disposableIncome: disposableIncome,
                amount: payment,
                minimum: this.config.paymentMinimum,
                allowNegativeDisposableIncome: allowNegativeDisposableIncome
            }
        )
        return Math.min(payment, state.principalStartOfYear);

    }

    protected override createNextState(previousState: DebtState): DebtState {
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