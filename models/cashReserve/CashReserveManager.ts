import ManagerBase from "~/models/common/ManagerBase";
import type {CashReserve} from "~/models/cashReserve/CashReserve";
import type {PlanState} from "~/models/plan/PlanState";
import type CashReserveState from "~/models/cashReserve/CashReserveState";
import type Command from "~/models/common/Command";
import type DebtState from "~/models/debt/DebtState";
import type {AllowNegativeDisposableIncome} from "~/models/plan/Plan";
import {adjustForAllowNegativeDisposableIncome} from "~/utils";

export default class CashReserveManager extends ManagerBase<CashReserve, CashReserveState> {
    protected createInitialState(): CashReserveState {
        return {
            cashReserveStartOfYear: this.config.initialAmount,
            cashReserveEndOfYear: undefined
        }
    }

    protected createNextState(previousState: CashReserveState): CashReserveState {
        assertDefined(previousState.cashReserveEndOfYear, 'cashReserveEndOfYear')
        return {
            cashReserveStartOfYear: previousState.cashReserveEndOfYear,
            cashReserveEndOfYear: undefined
        }
    }

    getCommands(): Command[] {
        return [];
    }

    calculateContribution(state: CashReserveState, disposableIncome: number, allowNegativeDisposableIncome: AllowNegativeDisposableIncome): number {
        let contribution = 0
        switch (this.config.cashReserveStrategy) {
            case 'fixed':
                contribution = Math.max(this.config.reserveAmount - state.cashReserveStartOfYear, 0);
                break
            case 'variable':
                contribution = Math.max(this.config.reserveAmount - state.cashReserveStartOfYear, 0);
                // TODO Implement this
                break
        }
        contribution = adjustForAllowNegativeDisposableIncome(
            {
                disposableIncome: disposableIncome,
                amount: contribution,
                minimum: 0,
                allowNegativeDisposableIncome: allowNegativeDisposableIncome
            }
        )
        return Math.min(contribution, state.cashReserveStartOfYear);
    }

    processImplementation(planState: PlanState): PlanState {
        const currentState = this.getCurrentState();
        const contribution = this.calculateContribution(currentState, planState.taxedIncome, planState.allowNegativeDisposableIncome)
        const cashReserveEndOfYear = currentState.cashReserveStartOfYear + contribution;
        this.updateCurrentState({
            ...currentState,
            cashReserveEndOfYear: cashReserveEndOfYear
        });
        return planState;
    }

}