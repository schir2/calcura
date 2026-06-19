import BaseManager from "~/models/common/BaseManager";
import type {Expense} from "~/types/Expense";
import type {ExpenseState} from "~/types/ExpenseState";

export class ExpenseManager extends BaseManager<Expense, ExpenseState> {
    protected createInitialState(): ExpenseState {
        return {
            base_amount: this.config.amount,
            amount_requested: 0,
            amount_paid: 0,
            shortfall: 0,
            processed: false,
            growth_amount: 0,
        };
    }

    createNextState(currentState: ExpenseState): ExpenseState {
        const growthAmount = this.calculateGrowthAmount(currentState.base_amount)
        const baseAmount = currentState.base_amount + growthAmount
        return {
            base_amount: baseAmount,
            amount_requested: 0,
            shortfall: 0,
            amount_paid: 0,
            processed: false,
            growth_amount: growthAmount,

        };
    }

    calculateGrowthAmount(amount: number): number {
        if (this.config.grows_with_inflation) {
            return amount * this.orchestrator.getConfig().inflation_rate / 100;
        }
        return amount * this.config.growth_rate / 100

    }

    calculatePayment(): number {
        const currentState = this.getCurrentState()
        return this._calculatePayment(currentState.base_amount);
    }

    private _calculatePayment(baseAmount: number): number {
        switch (this.config.frequency) {
            case 'annual':
                return baseAmount
            case 'monthly':
                return baseAmount * 12
            case 'quarterly':
                return baseAmount * 4
            case 'biweekly':
                return baseAmount * 26
            case 'weekly':
                return baseAmount * 52
        }
    }

    processImplementation(): void {
        const currentState = this.getCurrentState()
        const amountRequested = this.calculatePayment()
        const amountPaid = this.orchestrator.requestAndPayExpense(amountRequested)
        this.updateCurrentState({
            ...currentState,
            amount_requested: amountRequested,
            amount_paid: amountPaid,
            shortfall: amountRequested - amountPaid

        })
    }

}