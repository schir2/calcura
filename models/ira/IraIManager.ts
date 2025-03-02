import {type Ira, IraContributionStrategy} from '~/types/Ira';
import {assertDefined, calculateGrowthAmount} from "~/utils";
import type IraState from "~/types/IraState";
import BaseManager from "~/models/common/BaseManager";
import type {IncomeManager} from "~/models/income/IncomeManager";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionType} from "~/models/common";
import eventBus from "~/services/eventBus";
import {IRA_CONTRIBUTION_LIMIT_2024} from "~/constants/IraIConstants";

export class IraIManager extends BaseManager<Ira, IraState> {


    protected createInitialState(): IraState {
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

    get incomeManager(): IncomeManager | undefined {
        if (this.config.income) {
            return this.orchestrator.getManagerById('income', this.config.income.id)
        }
        eventBus.emit('warning', {scope: 'iraManager:missingIncomeManager', message: 'Missing income manager'})
        return undefined;
    }

    calculateContribution(): number {
        return calculateIraContribution(
            this.config,
            this.incomeManager?.getCurrentState().grossIncome,
            this.orchestrator.getCurrentState().iraLimit
        );
    }

    createNextState(previousState: IraState): IraState {
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
        this.orchestrator.contribute(contribution, ContributionType.Ira)
        this.orchestrator.invest(growthAmount + contribution, ContributionType.Ira)
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


export function calculateIraContribution(iraConfig: Ira, incomeAmount?: number, iraLimit: number = IRA_CONTRIBUTION_LIMIT_2024): number {
    let contribution = 0
    switch (iraConfig.contributionStrategy) {
        case IraContributionStrategy.Fixed:
            contribution = iraConfig.contributionFixedAmount
            break
        case IraContributionStrategy.PercentageOfIncome:
            if (incomeAmount === undefined) {

                eventBus.emit('warning', {
                    scope: 'iraManager:missingIncomeManager',
                    message: 'Cannot perform percentage of income without a lined income manager'
                })
                return 0
            }
            contribution = incomeAmount * iraConfig.contributionPercentage / 100
            break
        case IraContributionStrategy.Max:
            contribution = iraLimit
            break
    }
    return Math.min(contribution, iraLimit)
}