import BaseManager from "~/models/common/BaseManager";
import type {CashReserve} from "~/models/cashReserve/CashReserve";
import {CashReserveStrategy} from "~/models/cashReserve/CashReserve";
import type CashReserveState from "~/models/cashReserve/CashReserveState";
import type Command from "~/models/common/Command";
import {FundType} from "~/models/plan/PlanManager";

export class CashReserveManager extends BaseManager<CashReserve, CashReserveState> {
    protected createInitialState(): CashReserveState {
        return {
            amountRequested: undefined,
            amountPaid: undefined,
            cashReserveStartOfYear: this.config.initialAmount,
            cashReserveEndOfYear: undefined,
            processed: false,
        }
    }

    createNextState(previousState: CashReserveState): CashReserveState {
        assertDefined(previousState.cashReserveEndOfYear, 'cashReserveEndOfYear')
        return {
            amountRequested: undefined,
            amountPaid: undefined,
            cashReserveStartOfYear: previousState.cashReserveEndOfYear,
            cashReserveEndOfYear: undefined,
            processed: false,
        }
    }

    getCommands(): Command[] {
        return [];
    }

    calculateContribution(): number {
        const currentState = this.getCurrentState();
        let contribution = 0
        switch (this.config.cashReserveStrategy) {
            case CashReserveStrategy.Fixed:
                contribution = Math.max(this.config.reserveAmount - currentState.cashReserveStartOfYear, 0);
                break
            case CashReserveStrategy.Variable:
                contribution = Math.max(this.config.reserveAmount - currentState.cashReserveStartOfYear, 0);
                // TODO Implement this
                break
        }
        return contribution
    }

    processImplementation() {
        const currentState = this.getCurrentState();
        const contributionRequested = this.calculateContribution()
        const contribution = this.orchestrator.requestFunds(contributionRequested, FundType.Taxed)
        const cashReserveEndOfYear = currentState.cashReserveStartOfYear + contribution;
        this.orchestrator.withdraw(contribution, FundType.Taxed)
        this.updateCurrentState({
            ...currentState,
            amountPaid: contribution,
            amountRequested: contributionRequested,
            cashReserveEndOfYear: cashReserveEndOfYear
        });
    }

}