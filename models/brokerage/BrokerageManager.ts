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
            planState.grossIncome,
            planState.taxedCapital,
        )
    }

    protected createInitialState(): BrokerageState {
        return {
            contribution: 0,
            contributionLifetime: 0,
            growthAmount: 0,
            growthLifetime: 0,
            balanceStartOfYear: this.config.initialBalance,
            balanceEndOfYear: undefined,
            processed: false
        }
    }

    createNextState(previousState: BrokerageState): BrokerageState {
        assertDefined(previousState.balanceEndOfYear, 'balanceEndOfYear')
        return {
            contribution: 0,
            contributionLifetime: previousState.contributionLifetime,
            growthAmount: 0,
            growthLifetime: previousState.growthLifetime,
            balanceStartOfYear: previousState.balanceEndOfYear,
            balanceEndOfYear: undefined,
            processed: false,
        };
    }

    processImplementation() {
        const currentState = this.getCurrentState()
        const contributionRequest = this.calculateContribution()
        const contribution = this.orchestrator.requestFunds(contributionRequest, FundType.Taxed)
        this.orchestrator.withdraw(contribution, FundType.Taxed)
        const growthAmount = calculateGrowthAmount(
            currentState.balanceStartOfYear,
            this.config.growthRate,
            this.orchestrator.getConfig().growthApplicationStrategy,
            contribution
        )
        this.orchestrator.contribute(contribution, ContributionType.Taxable)
        this.orchestrator.invest(growthAmount + contribution, ContributionType.Taxable)
        const balanceEndOfYear = currentState.balanceStartOfYear + growthAmount + contribution
        this.updateCurrentState(
            {
                ...currentState,
                contribution: contribution,
                contributionLifetime: currentState.contributionLifetime + contribution,
                balanceEndOfYear: balanceEndOfYear,
                growthAmount: growthAmount,
                growthLifetime: currentState.growthLifetime + growthAmount

            }
        )
    }
}

export function calculateBrokerageContribution(brokerageConfig: Brokerage, grossIncome: number, taxedCapital: number): number {
    let contribution = 0
    switch (brokerageConfig.contributionStrategy) {
        case BrokerageContributionStrategy.Fixed:
            contribution = brokerageConfig.contributionFixedAmount
            break
        case BrokerageContributionStrategy.PercentageOfIncome:
            contribution = grossIncome * (brokerageConfig.contributionPercentage / 100)
            break
        case BrokerageContributionStrategy.Max:
            contribution = taxedCapital
            break
    }
    return contribution
}