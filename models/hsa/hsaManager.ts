import {type Hsa, HsaContributionStrategy} from '~/types/Hsa';
import {assertDefined, calculateGrowthAmount} from "~/utils";
import type HsaState from "~/types/HsaState";
import BaseManager from "~/models/common/BaseManager";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionType} from "~/models/common";

export class HsaManager extends BaseManager<Hsa, HsaState> {


    protected createInitialState(): HsaState {
        return {
            contribution: undefined,
            contributionLifetime: 0,
            growthAmount: undefined,
            growthLifetime: 0,
            balanceStartOfYear: this.config.initialBalance,
            balanceEndOfYear: undefined,
            processed: false,
        }
    }

    calculateContribution(): number {
        return calculateHsaContribution(
            this.config,
        );
    }

    createNextState(previousState: HsaState): HsaState {
        assertDefined(previousState.balanceEndOfYear, 'balanceEndOfYear')
        return {
            contribution: undefined,
            contributionLifetime: previousState.contributionLifetime,
            growthAmount: undefined,
            growthLifetime: previousState.growthLifetime,
            balanceStartOfYear: previousState.balanceEndOfYear,
            balanceEndOfYear: undefined,
            processed: false,
        };
    }

    processImplementation() {
        const currentState = this.getCurrentState()
        const contributionRequest = this.calculateContribution()
        const contribution = this.orchestrator.requestFunds(contributionRequest, FundType.Taxable)
        this.orchestrator.withdraw(contribution, FundType.Taxable)
        const growthAmount = calculateGrowthAmount(
            currentState.balanceStartOfYear,
            this.config.growthRate,
            this.orchestrator.getConfig().growthApplicationStrategy,
            contribution
        )
        this.orchestrator.contribute(contribution, ContributionType.Hsa)
        this.orchestrator.invest(growthAmount + contribution, ContributionType.Hsa)
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


export function calculateHsaContribution(hsaConfig: Hsa): number {
    let contribution = 0
    switch (hsaConfig.contributionStrategy) {
        case HsaContributionStrategy.Fixed:
            contribution = hsaConfig.contributionFixedAmount
            break
    }
    return Math.min(contribution)
}