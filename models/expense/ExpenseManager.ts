import BaseManager from "~/models/common/BaseManager";
import type Command from "~/models/common/Command";
import type {Expense} from "~/models/expense/Expense";
import {Frequency} from "~/models/expense/Expense";
import type ExpenseState from "~/models/expense/ExpenseState";

export class ExpenseManager extends BaseManager<Expense, ExpenseState> {
    protected createInitialState(): ExpenseState {
        return {
            baseAmount: this.config.amount,
            amountRequested: 0,
            amountPaid: 0,
            shortfall: 0,
            processed: false,
            growthAmount: 0,
        };
    }

    createNextState(currentState: ExpenseState): ExpenseState {
        const growthAmount = this.calculateGrowthAmount(currentState.baseAmount)
        const baseAmount = currentState.baseAmount + growthAmount
        return {
            baseAmount: baseAmount,
            amountRequested: 0,
            shortfall: 0,
            amountPaid: 0,
            processed: false,
            growthAmount: growthAmount,

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

    private _calculatePayment(baseAmount: number): number {
        switch (this.config.frequency) {
            case Frequency.Annually:
                return baseAmount
            case Frequency.Monthly:
                return baseAmount * 12
            case Frequency.Quarterly:
                return baseAmount * 4
            case Frequency.Biweekly:
                return baseAmount * 26
            case Frequency.Weekly:
                return baseAmount * 52
        }
    }

    override getCommands(): Command[] {
        return [{
            managerName: "expenseManagers",
            managerId: `${this.config.id}`,
            label: 'Expense',
            name: this.config.name,
            action: 'process',
        }];
    }

    processImplementation(): void {
        const currentState = this.getCurrentState()
        const amountRequested = this.calculatePayment()
        const amountPaid = this.orchestrator.requestAndPayExpense(amountRequested)
        this.updateCurrentState({
            ...currentState,
            amountRequested: amountRequested,
            amountPaid: amountPaid,
            shortfall: amountRequested - amountPaid

        })
    }

}