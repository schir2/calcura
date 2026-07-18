import type {Ira} from '#shared/types/Ira';
import {assertDefined} from "~/utils";
import type {IraState} from "#shared/types/IraState";
import {InvestmentAccountManager} from "~/models/common/InvestmentAccountManager";
import type {TaxCategory} from "~/models/common/InvestableManager";
import type {IncomeManager} from "~/models/income/IncomeManager";
import {FundType} from "~/models/plan/PlanManager";
import eventBus from "~/utils/eventBus";
import {ContributionType} from "#shared/types/ContributionType";
import {IRA_CONTRIBUTION_LIMIT_2024} from "~/constants/IraConstants";

export class IraManager extends InvestmentAccountManager<Ira, IraState> {
    readonly taxCategory: TaxCategory = 'tax_deferred';
    protected readonly contributionType = ContributionType.Ira;
    protected readonly fundType = FundType.Taxable;



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