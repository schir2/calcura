import {InvestableManager} from "~/models/common/InvestableManager";
import type {InvestmentState} from "#shared/types/InvestmentState";
import type {ContributionType} from "#shared/types/ContributionType";
import type {FundType} from "~/models/plan/PlanManager";

/**
 * Shared decomposed lifecycle for the InvestmentState-backed accounts (brokerage, tax_deferred, ira,
 * roth_ira, hsa). Provides grow / contribute / withdraw over the common balance fields; subclasses
 * supply their contribution type, funding type, and contribution math, and override only what is
 * genuinely special (brokerage: cost-basis; tax_deferred: elective/employer). cash_reserve does NOT
 * extend this — its state shape and no-growth behavior differ, so it stays on InvestableManager.
 * See ADR 009 amendment (2026-07-17) "decomposed manager operations".
 */
export abstract class InvestmentAccountManager<TConfig extends { growth_rate: number }, TState extends InvestmentState>
    extends InvestableManager<TConfig, TState> {

    protected abstract readonly contributionType: ContributionType;
    protected abstract readonly fundType: FundType;

    abstract calculateContribution(): number;

    processImplementation(): void {
        this.resetForYear()
        // growth_application_strategy is an explicit grow<->contribute ordering (ADR 009).
        const growFirst = this.orchestrator.getConfig().growth_application_strategy === 'start'
        if (growFirst) this.grow()
        if (!this.orchestrator.isRetired()) this.contribute()
        if (!growFirst) this.grow()
    }

    /** Zero this year's flow fields before grow/contribute accumulate into them. Subclasses with extra
     *  per-year fields (e.g. tax_deferred's elective/employer) extend this via super. */
    protected resetForYear(): void {
        const state = this.getCurrentState()
        this.updateCurrentState({
            ...state,
            contribution: 0,
            growth_amount: 0,
            balance_end_of_year: state.balance_start_of_year,
        })
    }

    grow(): void {
        const state = this.getCurrentState()
        const base = state.balance_end_of_year ?? state.balance_start_of_year
        const growthAmount = base * (this.config.growth_rate / 100)
        if (growthAmount !== 0) {
            this.orchestrator.invest(growthAmount, this.contributionType)
        }
        this.updateCurrentState({
            ...state,
            growth_amount: (state.growth_amount ?? 0) + growthAmount,
            growth_lifetime: state.growth_lifetime + growthAmount,
            balance_end_of_year: base + growthAmount,
        })
    }

    contribute(): void {
        const state = this.getCurrentState()
        const base = state.balance_end_of_year ?? state.balance_start_of_year
        const contribution = this.orchestrator.requestAndWithdraw(this.calculateContribution(), this.fundType)
        if (contribution !== 0) {
            this.orchestrator.contribute(contribution, this.contributionType)
            this.orchestrator.invest(contribution, this.contributionType)
        }
        this.updateCurrentState({
            ...state,
            contribution: (state.contribution ?? 0) + contribution,
            contribution_lifetime: state.contribution_lifetime + contribution,
            balance_end_of_year: base + contribution,
        })
    }

    // Retirement drawdown: gross up so `netNeed` net dollars are delivered, capped at the balance;
    // reduce the balance by gross, sync the plan bucket, return the net raised. Brokerage overrides
    // this to tax only the gain (pro-rata basis).
    withdraw(netNeed: number): number {
        if (netNeed <= 0) return 0
        const state = this.getCurrentState()
        const balance = state.balance_end_of_year ?? state.balance_start_of_year
        if (balance <= 0) return 0
        const rate = this.withdrawalRate()
        const gross = Math.min(balance, rate < 1 ? netNeed / (1 - rate) : balance)
        const net = gross * (1 - rate)
        this.orchestrator.invest(-gross, this.contributionType)
        this.updateCurrentState({...state, balance_end_of_year: balance - gross})
        return net
    }

    // Flat effective rate by tax category: tax_deferred = ordinary income; tax_exempt / cash = 0.
    // Brokerage (taxable) overrides withdraw() entirely for pro-rata capital-gains treatment.
    protected withdrawalRate(): number {
        return this.taxCategory === 'tax_deferred' ? (this.orchestrator.getConfig().tax_rate ?? 0) / 100 : 0
    }
}
