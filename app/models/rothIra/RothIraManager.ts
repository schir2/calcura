import type {RothIra} from '#shared/types/RothIra';
import {assertDefined} from "~/utils";
import type {RothIraState} from "#shared/types/RothIraState";
import {InvestmentAccountManager} from "~/models/common/InvestmentAccountManager";
import type {TaxCategory} from "~/models/common/InvestableManager";
import type {IncomeManager} from "~/models/income/IncomeManager";
import {FundType} from "~/models/plan/PlanManager";
import eventBus from "~/utils/eventBus";
import {IRA_CONTRIBUTION_LIMIT_2024} from "~/constants/IraConstants";
import {ContributionType} from "#shared/types/ContributionType";

export class RothIraManager extends InvestmentAccountManager<RothIra, RothIraState> {
    readonly taxCategory: TaxCategory = 'tax_exempt';
    protected readonly contributionType = ContributionType.RothIra;
    protected readonly fundType = FundType.Taxed;



    protected createInitialState(): RothIraState {
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
            return this.orchestrator.getManagerById<IncomeManager>('income', this.config.income.id)
        }
        eventBus.emit('warning', {scope: 'rothIraManager:missingIncomeManager', message: 'Missing income manager'})
        return undefined;
    }

    calculateContribution(): number {
        return calculateRothIraContribution(
            this.config,
            this.incomeManager?.getCurrentState().gross_income,
            this.orchestrator.getCurrentState().limits.ira
        );
    }

    createNextState(previousState: RothIraState): RothIraState {
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

}


export function calculateRothIraContribution(rothIraConfig: RothIra, incomeAmount?: number, iraLimit: number = IRA_CONTRIBUTION_LIMIT_2024): number {
    let contribution = 0
    switch (rothIraConfig.contribution_strategy) {
        case 'fixed':
            contribution = rothIraConfig.contribution_fixed_amount ?? 0
            break
        case 'percentage_of_income':
            if (incomeAmount === undefined) {

                eventBus.emit('warning', {
                    scope: 'rothIraManager:missingIncomeManager',
                    message: 'Cannot perform percentage of income without a lined income manager'
                })
                return 0
            }
            contribution = incomeAmount * (rothIraConfig.contribution_percentage ?? 0) / 100
            break
        case 'max':
            contribution = iraLimit
            break
    }
    return Math.min(contribution, iraLimit)
}