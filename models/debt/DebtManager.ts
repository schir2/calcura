import DebtConfig from "~/models/debt/DebtConfig";
import type DebtState from "~/models/debt/DebtState";
import {AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";
import {adjustForAllowNegativeDisposableIncome} from "~/utils";

export default class DebtManager {
    private config: DebtConfig
    states: DebtState[] = []

    constructor(config: DebtConfig) {
        this.config = config;
        const initialState = this.createInitialState()
        this.states.push(initialState)
    }

    private createInitialState(): DebtState {
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

    getCurrentState(): DebtState {
        if (this.states.length === 0) {
            throw new Error("No states available. Ensure an initial state is created.");
        }
        return this.states[this.states.length - 1];
    }

    updateCurrentState(newState: DebtState): void {
        if (this.states.length === 0) {
            throw new Error("No states available. Ensure an initial state is created.");
        }
        this.states[this.states.length - 1] = newState
    }

    process(disposableIncome: number, allowNegativeDisposableIncome: AllowNegativeDisposableIncome): DebtState {
        const initialState = this.getCurrentState();
        const newState = this.processState(initialState, disposableIncome, allowNegativeDisposableIncome);
        this.updateCurrentState(newState)
        return newState;
    }


    private processState(state: DebtState, disposableIncome: number, allowNegativeDisposableIncome: AllowNegativeDisposableIncome) {
        if (state.processed) {
            throw new Error("The current state has already been processed.");
        }

        const payment = this.calculatePayment(state, disposableIncome, allowNegativeDisposableIncome)
        const principalEndOfYear = state.principalStartOfYear - payment;
        const interestAmount = principalEndOfYear * (this.config.interestRate / 100);
        const interestLifetime = state.interestLifetime + interestAmount;
        const paymentLifetime = state.paymentLifetime + state.payment;
        const updatedPrincipalEndOfYear = principalEndOfYear + interestAmount;
        return {
            ...state,
            payment: payment,
            interestLifetime: interestLifetime,
            paymentLifetime: paymentLifetime,
            principalEndOfYear: updatedPrincipalEndOfYear,
            interestAmount: interestAmount,
            processed: true,
        };
    }

    calculatePayment(state: DebtState, disposableIncome: number, allowNegativeDisposableIncome: AllowNegativeDisposableIncome): number {
        let payment = 0
        switch (this.config.paymentStrategy) {
            case 'fixed':
                payment = this.config.paymentFixedAmount;
                break
            case 'percentage_of_debt':
                payment = state.principalStartOfYear * (this.config.paymentFixedAmount / 100);
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

    advanceToNextYear(): DebtState {
        const previousState = this.getCurrentState();
        if (!previousState.processed) {
            throw new Error("The current state has not been processed.");
        }
        assertDefined(previousState.principalEndOfYear, 'principalEndOfYear')
        const newState: DebtState = {
            ...previousState,
            payment: 0,
            principalStartOfYear: previousState.principalEndOfYear,
            principalEndOfYear: undefined,
            interestAmount: undefined,
            processed: false
        };
        this.states.push(newState);
        return newState
    }
}