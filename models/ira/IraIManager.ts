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
            contribution_lifetime: 0,
            growth_amount: undefined,
            growth_lifetime: 0,
            balance_start_of_year: this.config.initial_balance,
            balance_end_of_year: undefined,
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
            this.incomeManager?.getCurrentState().gross_income,
            this.orchestrator.getCurrentState().ira_limit
        );
    }

    createNextState(previousState: IraState): IraState {
        assertDefined(previousState.balance_end_of_year, 'balanceEndOfYear')
        return {
            contribution: undefined,
            contribution_lifetime: previousState.contribution_lifetime,
            growth_amount: undefined,
            growth_lifetime: previousState.growth_lifetime,
            balance_start_of_year: previousState.balance_end_of_year,
            balance_end_of_year: undefined,
            processed: false,
        };
    }

    processImplementation() {
        const currentState = this.getCurrentState()
        const contributionRequest = this.calculateContribution()
        const contribution = this.orchestrator.requestFunds(contributionRequest, FundType.Taxable)
        this.orchestrator.withdraw(contribution, FundType.Taxable)
        const growthAmount = calculateGrowthAmount(
            currentState.balance_start_of_year,
            this.config.growth_rate,
            this.orchestrator.getConfig().growth_application_strategy,
            contribution
        )
        this.orchestrator.contribute(contribution, ContributionType.Ira)
        this.orchestrator.invest(growthAmount + contribution, ContributionType.Ira)
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


export function calculateIraContribution(iraConfig: Ira, incomeAmount?: number, iraLimit: number = IRA_CONTRIBUTION_LIMIT_2024): number {
    let contribution = 0
    switch (iraConfig.contribution_strategy) {
        case IraContributionStrategy.Fixed:
            contribution = iraConfig.contribution_fixed_amount
            break
        case IraContributionStrategy.PercentageOfIncome:
            if (incomeAmount === undefined) {

                eventBus.emit('warning', {
                    scope: 'iraManager:missingIncomeManager',
                    message: 'Cannot perform percentage of income without a lined income manager'
                })
                return 0
            }
            contribution = incomeAmount * iraConfig.contribution_percentage / 100
            break
        case IraContributionStrategy.Max:
            contribution = iraLimit
            break
    }
    return Math.min(contribution, iraLimit)
}