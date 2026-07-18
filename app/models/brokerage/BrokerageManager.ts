import type {Brokerage} from '#shared/types/Brokerage';
import {assertDefined} from "~/utils";
import type {BrokerageState} from "#shared/types/BrokerageState";
import {InvestmentAccountManager} from "~/models/common/InvestmentAccountManager";
import type {TaxCategory} from "~/models/common/InvestableManager";
import {FundType} from "~/models/plan/PlanManager";

import {ContributionType} from "#shared/types/ContributionType";

export class BrokerageManager extends InvestmentAccountManager<Brokerage, BrokerageState> {
    readonly taxCategory: TaxCategory = 'taxable';
    protected readonly contributionType = ContributionType.Taxable;
    protected readonly fundType = FundType.Taxed;


    calculateContribution(): number {
        const planState = this.orchestrator.getCurrentState()
        return calculateBrokerageContribution(
            this.config,
            planState.income.gross,
            planState.cash.net,
        )
    }

    protected createInitialState(): BrokerageState {
        return {
            contribution: 0,
            contribution_lifetime: 0,
            growth_amount: 0,
            growth_lifetime: 0,
            balance_start_of_year: this.config.initial_balance,
            balance_end_of_year: undefined,
            cost_basis: this.config.initial_balance,
            processed: false
        }
    }

    createNextState(previousState: BrokerageState): BrokerageState {
        assertDefined(previousState.balance_end_of_year, 'balanceEndOfYear')
        return {
            contribution: 0,
            contribution_lifetime: previousState.contribution_lifetime,
            growth_amount: 0,
            growth_lifetime: previousState.growth_lifetime,
            balance_start_of_year: previousState.balance_end_of_year,
            balance_end_of_year: undefined,
            cost_basis: previousState.cost_basis,
            processed: false,
        };
    }

    // Overrides the base to also track cost basis (post-tax dollars in), for pro-rata withdrawal tax.
    contribute(): void {
        const state = this.getCurrentState()
        const base = state.balance_end_of_year ?? state.balance_start_of_year
        const contributionRequest = this.calculateContribution()
        const contribution = this.orchestrator.requestAndWithdraw(contributionRequest, FundType.Taxed)
        if (contribution !== 0) {
            this.orchestrator.contribute(contribution, ContributionType.Taxable)
            this.orchestrator.invest(contribution, ContributionType.Taxable)
        }
        this.updateCurrentState({
            ...state,
            contribution: (state.contribution ?? 0) + contribution,
            contribution_lifetime: state.contribution_lifetime + contribution,
            cost_basis: state.cost_basis + contribution,
            balance_end_of_year: base + contribution,
        })
    }

    // Retirement drawdown: only the gain is taxed (pro-rata cost basis). Grosses up so `netNeed`
    // net dollars are delivered, capped at the balance; returns the net actually raised.
    withdraw(netNeed: number): number {
        if (netNeed <= 0) return 0
        const state = this.getCurrentState()
        const balance = state.balance_end_of_year ?? state.balance_start_of_year
        if (balance <= 0) return 0
        const capGainsRate = (this.orchestrator.getConfig().capital_gains_rate ?? 0) / 100
        const gainFraction = Math.max(0, (balance - state.cost_basis) / balance)
        const effectiveRate = gainFraction * capGainsRate
        const gross = Math.min(balance, effectiveRate < 1 ? netNeed / (1 - effectiveRate) : balance)
        const net = gross * (1 - effectiveRate)
        const basisRemoved = state.cost_basis * (gross / balance)
        this.orchestrator.invest(-gross, ContributionType.Taxable)
        this.updateCurrentState({
            ...state,
            balance_end_of_year: balance - gross,
            cost_basis: state.cost_basis - basisRemoved,
        })
        return net
    }
}

export function calculateBrokerageContribution(brokerageConfig: Brokerage, grossIncome: number, taxedCapital: number): number {
    let contribution = 0
    switch (brokerageConfig.contribution_strategy) {
        case 'fixed':
            contribution = brokerageConfig.contribution_fixed_amount ?? 0
            break
        case 'percentage_of_income':
            contribution = grossIncome * ((brokerageConfig.contribution_percentage ?? 0) / 100)
            break
        case 'max':
            contribution = taxedCapital
            break
    }
    return contribution
}