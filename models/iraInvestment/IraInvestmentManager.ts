import {IraContributionStrategy, type IraInvestment} from './IraInvestment';
import {assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import type IraInvestmentState from "~/models/iraInvestment/IraInvestmentState";
import BaseManager from "~/models/common/BaseManager";
import type Command from "~/models/common/Command";
import type {IncomeManager} from "~/models/income/IncomeManager";
import {ProcessIraInvestmentCommand} from "~/models/iraInvestment/IraInvestmentCommands";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionType} from "~/models/common";

export class IraInvestmentManager extends BaseManager<IraInvestment, IraInvestmentState> {


    protected createInitialState(): IraInvestmentState {
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
            case IraContributionStrategy.Fixed:
                contribution = this.config.contributionFixedAmount
                break
            case IraContributionStrategy.PercentageOfIncome:
                if (this.incomeManager === undefined) {
                    throw new Error('Cannot perform percentage of income without a lined income manager')
                }
                contribution = this.incomeManager.getCurrentState().grossIncome * this.config.contributionPercentage / 100
                break
            case IraContributionStrategy.Max:
                contribution = Infinity
                break
        }
        return Math.min(contribution, this.orchestrator.getCurrentState().iraLimit)
    }

    createNextState(previousState: IraInvestmentState): IraInvestmentState {
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
        return [new ProcessIraInvestmentCommand(this)];
    }

    processImplementation() {
        const currentState = this.getCurrentState()
        const contributionRequest = this.calculateContribution()
        const contribution = this.orchestrator.requestFunds(contributionRequest, FundType.Taxable)
        this.orchestrator.withdraw(contribution, FundType.Taxable)
        const growthAmount = calculateInvestmentGrowthAmount(
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
