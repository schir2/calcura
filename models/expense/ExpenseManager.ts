import BaseManager from "~/models/common/BaseManager";
import type Command from "~/models/common/Command";
import type {Expense} from "~/models/expense/Expense";
import {ExpenseFrequency} from "~/models/expense/Expense";
import type ExpenseState from "~/models/expense/ExpenseState";
import {FundType} from "~/models/plan/PlanManager";
import {ProcessExpenseCommand} from "~/models/expense/ExpenseCommands";

export class ExpenseManager extends BaseManager<Expense, ExpenseState> {
    protected createInitialState(): ExpenseState {
        return {
            baseAmount: this.config.amount,
            amountRequested: 0,
            amountPaid: 0,
            processed: false,
        };
    }

    createNextState(previousState: ExpenseState): ExpenseState {
        return {
            baseAmount: 0,
            amountRequested: 0,
            amountPaid: 0,
            processed: false,

        };
    }

    calculateGrowthAmount(amount: number): number {
        if (this.config.growsWithInflation) {
            return amount * this.orchestrator.getConfig().inflationRate / 100;
        }
        return amount * this.config.growthRate / 100

    }

    calculatePayment(): number {
        const currentState = this.getCurrentState()
        return this._calculatePayment(currentState.baseAmount);
    }

    private _calculatePayment(baseAmount: number) {
        switch (this.config.frequency) {
            case ExpenseFrequency.Annually:
                return baseAmount
            case ExpenseFrequency.Monthly:
                return baseAmount * 12
            case ExpenseFrequency.Quarterly:
                return baseAmount * 4
            case ExpenseFrequency.Weekly:
                return baseAmount * 52
        }
    }

    getCommands(): Command[] {
        return [new ProcessExpenseCommand(this)];
    }

    processImplementation(): void {
        const currentState = this.getCurrentState()
        const amountRequested = this.calculatePayment()
        const amountPaid = this.orchestrator.requestFunds(amountRequested, FundType.Taxed)
        const baseAmount = currentState.baseAmount + this.calculateGrowthAmount(currentState.baseAmount)
        this.orchestrator.withdraw(amountPaid, FundType.Taxed)
        this.updateCurrentState({
            ...currentState,
            amountRequested: amountRequested,
            amountPaid: amountPaid,
            baseAmount: baseAmount,

        })
    }

}