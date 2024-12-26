import BaseManager from "~/models/common/BaseManager";
import type Command from "~/models/common/Command";
import type {Expense} from "~/models/expense/Expense";
import {ExpenseFrequency} from "~/models/expense/Expense";
import type ExpenseState from "~/models/expense/ExpenseState";
import {FundType} from "~/models/plan/PlanManager";

export default class ExpenseManager extends BaseManager<Expense, ExpenseState> {
    protected createInitialState(): ExpenseState {
        return {
            payment: 0,
            isPaid: false,
            isActive: undefined,
            processed: false,
        };
    }

    createNextState(previousState: ExpenseState): ExpenseState {
        return {
            payment: 0,
            isPaid: false,
            isActive: undefined,
            processed: false,

        };
    }

    protected calculatePayment(): number {
        const currentState = this.getCurrentState()
        if (currentState.isActive === false){
            return 0
        }
        switch(this.config.frequency){
            case ExpenseFrequency.Annually:
                return currentState.payment
            case ExpenseFrequency.Monthly:
                return currentState.payment * 12
            case ExpenseFrequency.OneTime:
                return currentState.payment
            case ExpenseFrequency.Quarterly:
                return currentState.payment * 4
            case ExpenseFrequency.Weekly:
                return currentState.payment * 52
        }
    }

    getCommands(): Command[] {
        return [];
    }

    processImplementation(): void {
        const paymentRequest = this.calculatePayment()
        const payment = this.orchestrator.requestFunds(paymentRequest, FundType.Taxed)
        this.orchestrator.withdraw(payment, FundType.Taxed)
    }

}