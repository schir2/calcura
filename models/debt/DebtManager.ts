import DebtConfig from "~/models/debt/DebtConfig";
import type DebtState from "~/models/debt/DebtState";
import {AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";
import {adjustForAllowNegativeDisposableIncome, assertDefined} from "~/utils";
import ManagerBase from "~/models/common/ManagerBase";
import type PlanState from "~/models/plan/PlanState";
import {ProcessDebtCommand} from "~/models/debt/DebtCommands";
import type Command from "~/models/common/Command";

export default class DebtManager extends ManagerBase<DebtConfig, DebtState> {

    override createInitialState(): DebtState {
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

    process(planState: PlanState): PlanState {
        const currentState = this.getCurrentState();
        if (currentState.processed) {
            throw new Error("The current state has already been processed.");
        }
        const payment = this.calculatePayment(currentState, planState.disposableIncome, planState.allowNegativeDisposableIncome)
        const principalEndOfYear = currentState.principalStartOfYear - payment;
        const interestAmount = principalEndOfYear * (this.config.interestRate / 100);
        const interestLifetime = currentState.interestLifetime + interestAmount;
        const paymentLifetime = currentState.paymentLifetime + currentState.payment;
        const updatedPrincipalEndOfYear = principalEndOfYear + interestAmount;
        this.updateCurrentState({
            ...currentState,
            payment: payment,
            processed: true,
            interestAmount: interestAmount,
            interestLifetime: interestLifetime,
            paymentLifetime: paymentLifetime,
            principalEndOfYear: updatedPrincipalEndOfYear
        })
        const updatedDisposableIncome = planState.disposableIncome - payment
        return {
            ...planState,
            disposableIncome: updatedDisposableIncome
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
                allowNegative: allowNegativeDisposableIncome
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