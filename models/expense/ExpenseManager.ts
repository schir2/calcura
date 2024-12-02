import ManagerBase from "~/models/common/ManagerBase";
import type PlanState from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";
import type ExpenseConfig from "~/models/expense/ExpenseConfig";
import type ExpenseState from "~/models/expense/ExpenseState";
import type {AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";
import {DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME} from "~/models/plan/PlanConstants";

export default class ExpenseManager extends ManagerBase<ExpenseConfig, ExpenseState> {
    protected createInitialState(): ExpenseState {
        return {
            payment: 0,
            isPaid: false,
            isActive: undefined,
        };
    }

    protected getActiveState(date: Date): boolean {
        return true
    }

    protected createNextState(previousState: ExpenseState): ExpenseState {
        return {
            payment: 0,
            isPaid: false,
            isActive: undefined,

        };
    }

    protected getPayment(disposableIncome: number, allowNegativeDisposableIncome?: AllowNegativeDisposableIncome): number {
        return adjustForAllowNegativeDisposableIncome(
            {
                disposableIncome: disposableIncome,
                amount: this.getConfig().amount,
                allowNegativeDisposableIncome: allowNegativeDisposableIncome ?? DEFAULT_ALLOW_NEGATIVE_DISPOSABLE_INCOME
            })
    }

    getCommands(): Command[] {
        return [];
    }

    processImplementation(planState: PlanState): PlanState {
        const payment = this.getPayment(planState.taxedIncome, planState.allowNegativeDisposableIncome)
        return {
            ...planState,
            taxedIncome: planState.taxedIncome - payment,
        }
    }

}