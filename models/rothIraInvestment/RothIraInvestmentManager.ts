import {RothIraContributionStrategy, type RothIraInvestment} from './RothIraInvestment';
import {assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import type RothIraInvestmentState from "~/models/rothIraInvestment/RothIraInvestmentState";
import BaseManager from "~/models/common/BaseManager";
import type Command from "~/models/common/Command";
import type IncomeManager from "~/models/income/IncomeManager";
import {ProcessRothIraInvestmentCommand} from "~/models/rothIraInvestment/RothIraInvestmentCommands";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionType} from "~/models/common";

export class RothIraInvestmentManager extends BaseManager<RothIraInvestment, RothIraInvestmentState> {


    protected createInitialState(): RothIraInvestmentState {
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

    get incomeManager(): IncomeManager {
        if (this.config.income === undefined) {
            throw new Error("Missing income configuration");
        }
        return this.orchestrator.getIncomeManagerById(this.config.income.id)
    }

    calculateContribution(): number {
        let contribution = 0
        switch (this.config.contributionStrategy) {
            case RothIraContributionStrategy.Fixed:
                contribution = this.config.contributionFixedAmount
                break
            case RothIraContributionStrategy.PercentageOfIncome:
                if (this.incomeManager === undefined) {
                    throw new Error('Cannot perform percentage of income without a lined income manager')
                }
                contribution = this.incomeManager.getCurrentState().grossIncome * this.config.contributionPercentage / 100
                break
            case RothIraContributionStrategy.Max:
                contribution = Infinity
                break
        }
        return Math.min(contribution, this.orchestrator.getCurrentState().iraLimit)
    }

    createNextState(previousState: RothIraInvestmentState): RothIraInvestmentState {
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


    getCommands(): Command[] {
        return [new ProcessRothIraInvestmentCommand(this)];
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
        this.orchestrator.contribute(contribution, ContributionType.RothIra)
        this.orchestrator.invest(growthAmount + contribution, ContributionType.RothIra)
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
