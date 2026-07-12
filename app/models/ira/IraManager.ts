import type {Ira} from '#shared/types/Ira';
import {assertDefined, calculateGrowthAmount} from "~/utils";
import type {IraState} from "#shared/types/IraState";
import BaseManager from "~/models/common/BaseManager";
import type {IncomeManager} from "~/models/income/IncomeManager";
import {FundType} from "~/models/plan/PlanManager";
import eventBus from "~/utils/eventBus";
import {ContributionType} from "#shared/types/ContributionType";
import {IRA_CONTRIBUTION_LIMIT_2024} from "~/constants/IraConstants";

export class IraManager extends BaseManager<Ira, IraState> {


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
        // eventBus.emit('warning', {scope: 'iraManager:missingIncomeManager', message: 'Missing income manager'})
        return undefined;
    }

    calculateContribution(): number {
        return calculateIraContribution(
            this.config,
            this.incomeManager?.getCurrentState().gross_income,
            this.orchestrator.getCurrentState().limits.ira
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
        const contribution = this.orchestrator.requestAndWithdraw(contributionRequest, FundType.Taxable)
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
        case 'fixed':
            contribution = iraConfig.contribution_fixed_amount ?? 0
            break
        case 'percentage_of_income':
            if (incomeAmount === undefined) {

                eventBus.emit('warning', {
                    scope: 'iraManager:missingIncomeManager',
                    message: 'Cannot perform percentage of income without a lined income manager'
                })
                return 0
            }
            contribution = incomeAmount * (iraConfig.contribution_percentage ?? 0) / 100
            break
        case 'max':
            contribution = iraLimit
            break
    }
    return Math.min(contribution, iraLimit)
}