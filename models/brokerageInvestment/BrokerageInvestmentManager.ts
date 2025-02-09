import {BrokerageContributionStrategy, type BrokerageInvestment} from './BrokerageInvestment';
import {assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import type BrokerageInvestmentState from "~/models/brokerageInvestment/BrokerageInvestmentState";
import BaseManager from "~/models/common/BaseManager";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionType} from "~/models/common";
import type {PlanState} from "~/models/plan/PlanState";

export class BrokerageInvestmentManager extends BaseManager<BrokerageInvestment, BrokerageInvestmentState> {

    calculateContribution(): number {
        return calculateBrokerageInvestmentContribution(
            this.config,
            this.orchestrator.getCurrentState())
    }

    protected createInitialState(): BrokerageInvestmentState {
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

    createNextState(previousState: BrokerageInvestmentState): BrokerageInvestmentState {
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
        const growthAmount = calculateInvestmentGrowthAmount(
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

export function calculateBrokerageInvestmentContribution(brokerageInvestmentConfig: BrokerageInvestment, planState: PlanState): number {
    let contribution = 0
    switch (brokerageInvestmentConfig.contributionStrategy) {
        case BrokerageContributionStrategy.Fixed:
            contribution = brokerageInvestmentConfig.contributionFixedAmount
            break
        case BrokerageContributionStrategy.PercentageOfIncome:
            contribution = planState.grossIncome * (brokerageInvestmentConfig.contributionPercentage / 100)
            break
        case BrokerageContributionStrategy.Max:
            contribution = planState.taxedCapital
            break
    }
    return contribution
}