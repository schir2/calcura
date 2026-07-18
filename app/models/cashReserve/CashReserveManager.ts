import {InvestableManager, type TaxCategory} from "~/models/common/InvestableManager";
import type {CashReserve} from "#shared/types/CashReserve";
import type CashReserveState from "#shared/types/CashReserveState";
import {FundType} from "~/models/plan/PlanManager";

import {ContributionType} from "#shared/types/ContributionType";

export class CashReserveManager extends InvestableManager<CashReserve, CashReserveState> {
    readonly taxCategory: TaxCategory = 'cash';

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
        const state = this.getCurrentState();
        this.updateCurrentState({
            ...state,
            amount_requested: 0,
            amount_paid: 0,
            cash_reserve_end_of_year: state.cash_reserve_start_of_year,
        })
        // Cash reserve holds cash — no market return (no grow). Funding stops in retirement.
        if (!this.orchestrator.isRetired()) this.contribute()
    }

    contribute(): void {
        const state = this.getCurrentState()
        const base = state.cash_reserve_end_of_year ?? state.cash_reserve_start_of_year
        const contributionRequested = this.calculateContribution()
        const contribution = this.orchestrator.requestAndWithdraw(contributionRequested, FundType.Taxed)
        if (contribution !== 0) {
            this.orchestrator.contribute(contribution, ContributionType.CashReserve)
            this.orchestrator.invest(contribution, ContributionType.CashReserve)
        }
        this.updateCurrentState({
            ...state,
            amount_requested: contributionRequested,
            amount_paid: contribution,
            cash_reserve_end_of_year: base + contribution,
        })
    }

    // The emergency fund is zero-tax; drained last in the predefined order.
    withdraw(netNeed: number): number {
        if (netNeed <= 0) return 0
        const state = this.getCurrentState()
        const balance = state.cash_reserve_end_of_year ?? state.cash_reserve_start_of_year
        if (balance <= 0) return 0
        const gross = Math.min(balance, netNeed)
        this.orchestrator.invest(-gross, ContributionType.CashReserve)
        this.updateCurrentState({...state, cash_reserve_end_of_year: balance - gross})
        return gross
    }

}