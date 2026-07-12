import BaseManager from "~/models/common/BaseManager";
import type {CashReserve} from "#shared/types/CashReserve";
import type CashReserveState from "#shared/types/CashReserveState";
import {FundType} from "~/models/plan/PlanManager";

import {ContributionType} from "#shared/types/ContributionType";

export class CashReserveManager extends BaseManager<CashReserve, CashReserveState> {
    protected createInitialState(): CashReserveState {
        return {
            amount_requested: undefined,
            amount_paid: undefined,
            cash_reserve_start_of_year: this.config.initial_amount,
            cash_reserve_end_of_year: undefined,
            processed: false,
        }
    }

    createNextState(previousState: CashReserveState): CashReserveState {
        assertDefined(previousState.cash_reserve_end_of_year, 'cashReserveEndOfYear')
        return {
            amount_requested: undefined,
            amount_paid: undefined,
            cash_reserve_start_of_year: previousState.cash_reserve_end_of_year,
            cash_reserve_end_of_year: undefined,
            processed: false,
        }
    }

    calculateContribution(): number {
        const currentState = this.getCurrentState();
        let contribution = 0
        switch (this.config.cash_reserve_strategy) {
            case 'fixed':
                contribution = Math.max((this.config.reserve_amount ?? 0) - currentState.cash_reserve_start_of_year, 0);
                break
            case 'variable':
                const annualExpenseTotal = this.orchestrator.getAnnualExpenseTotal()
                contribution = Math.max(annualExpenseTotal * ((this.config.reserve_months ?? 0) / 12) - currentState.cash_reserve_start_of_year, 0);
                break
        }
        return contribution
    }

    processImplementation() {
        const currentState = this.getCurrentState();
        const contributionRequested = this.calculateContribution()
        const contribution = this.orchestrator.requestAndWithdraw(contributionRequested, FundType.Taxed)
        const cashReserveEndOfYear = currentState.cash_reserve_start_of_year + contribution;
        this.orchestrator.contribute(contribution, ContributionType.CashReserve)
        this.orchestrator.invest(contribution, ContributionType.CashReserve)
        this.updateCurrentState({
            ...currentState,
            amount_paid: contribution,
            amount_requested: contributionRequested,
            cash_reserve_end_of_year: cashReserveEndOfYear
        });
    }

}