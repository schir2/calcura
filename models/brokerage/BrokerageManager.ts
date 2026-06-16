import {type Brokerage, BrokerageContributionStrategy} from '~/types/Brokerage';
import {assertDefined, calculateGrowthAmount} from "~/utils";
import type BrokerageState from "~/types/BrokerageState";
import BaseManager from "~/models/common/BaseManager";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionType} from "~/models/common";

export class BrokerageManager extends BaseManager<Brokerage, BrokerageState> {

    calculateContribution(): number {
        const planState = this.orchestrator.getCurrentState()
        return calculateBrokerageContribution(
            this.config,
            planState.gross_income,
            planState.taxed_capital,
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
            processed: false,
        };
    }

    processImplementation() {
        const currentState = this.getCurrentState()
        const contributionRequest = this.calculateContribution()
        const contribution = this.orchestrator.requestFunds(contributionRequest, FundType.Taxed)
        this.orchestrator.withdraw(contribution, FundType.Taxed)
        const growthAmount = calculateGrowthAmount(
            currentState.balance_start_of_year,
            this.config.growth_rate,
            this.orchestrator.getConfig().growth_application_strategy,
            contribution
        )
        this.orchestrator.contribute(contribution, ContributionType.Taxable)
        this.orchestrator.invest(growthAmount + contribution, ContributionType.Taxable)
        const balanceEndOfYear = currentState.balance_start_of_year + growthAmount + contribution
        this.updateCurrentState(
            {
                ...currentState,
                contribution: contribution,
                contribution_lifetime: currentState.contribution_lifetime + contribution,
                balance_end_of_year: balanceEndOfYear,
                growth_amount: growthAmount,
                growth_lifetime: currentState.growth_lifetime + growthAmount

            }
        )
    }
}

export function calculateBrokerageContribution(brokerageConfig: Brokerage, grossIncome: number, taxedCapital: number): number {
    let contribution = 0
    switch (brokerageConfig.contribution_strategy) {
        case BrokerageContributionStrategy.Fixed:
            contribution = brokerageConfig.contribution_fixed_amount
            break
        case BrokerageContributionStrategy.PercentageOfIncome:
            contribution = grossIncome * (brokerageConfig.contribution_percentage / 100)
            break
        case BrokerageContributionStrategy.Max:
            contribution = taxedCapital
            break
    }
    return contribution
}