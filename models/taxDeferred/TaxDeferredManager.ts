import type {TaxDeferred} from '~/types/TaxDeferred';
import {assertDefined, calculateGrowthAmount} from "~/utils";
import type TaxDeferredState from "~/types/TaxDeferredState";
import BaseManager from "~/models/common/BaseManager";
import type {IncomeManager} from "~/models/income/IncomeManager";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionLimitType} from "~/types/Plan";
import eventBus from "~/services/eventBus";
import {ContributionType} from "~/types/ContributionType";

export class TaxDeferredManager extends BaseManager<TaxDeferred, TaxDeferredState> {

    protected createInitialState(): TaxDeferredState {
        return {
            contribution: undefined,
            contribution_lifetime: 0,
            elective_contribution: undefined,
            elective_contribution_lifetime: 0,
            employer_contribution: undefined,
            employer_contribution_lifetime: 0,
            growth_amount: undefined,
            growth_lifetime: 0,
            balance_start_of_year: this.config.initial_balance,
            balance_end_of_year: undefined,
            processed: false
        };
    }

    get incomeManager(): IncomeManager | undefined {
        if (this.config.income) {
            return this.orchestrator.getManagerById<IncomeManager>('income', this.config.income.id)
        }
        eventBus.emit('warning', {
            scope: 'taxDeferredManager:missingIncomeManager',
            message: 'Missing income manager'
        })
        return undefined;
    }

    calculateElectiveContribution(): number {
        let contribution = 0
        switch (this.config.elective_contribution_strategy) {
            case 'fixed':
                contribution = this.config.elective_contribution_fixed_amount ?? 0
                break
            case 'percentage_of_income':
                if (this.incomeManager === undefined) {
                    eventBus.emit('error', {
                        scope: 'taxDeferredManager:missingIncomeManager',
                        message: 'Cannot perform percentage of income without a lined income manager'
                    })
                    return 0
                }
                contribution = this.incomeManager.getCurrentState().gross_income * ((this.config.elective_contribution_percentage ?? 0) / 100)
                break
            case 'until_company_match':
                if (this.config.employer_contribution_strategy === 'percentage_of_contribution') {
                    contribution = this.getContributionFromEmployerMatchLimit(this.getEmployerMatchLimit());
                } else {
                    contribution = this.calculateEmployerContribution()
                }
                break
            case 'max':
                contribution = Infinity
                break
            default:

                throw new Error(`Invalid elective contribution strategy ${this.config.elective_contribution_strategy || 'blank'}`)
        }
        return contribution
    }

    private getContributionFromEmployerMatchLimit(employerMatchLimit: number) {
        const employerMatchPercentage = this.config.employer_match_percentage ?? 0
        if (employerMatchPercentage === 0) {
            return 0
        }
        return employerMatchLimit * 100 / employerMatchPercentage
    }

    calculateEmployerContribution(): number {
        let employerContribution = 0
        let electiveContribution = 0

        switch (this.config.employer_contribution_strategy) {
            case 'none':
                employerContribution = 0
                break

            case 'percentage_of_contribution':
                if (this.incomeManager === undefined) {
                    eventBus.emit('error', {
                        scope: 'taxDeferredManager:missingIncomeManager',
                        message: 'Cannot perform percentage of income without a lined income manager'
                    })
                    return 0
                }
                if ((this.getConfig().employer_match_percentage ?? 0) <= 0) {

                    eventBus.emit('warning', {scope: 'calculateEmployerContribution:employerMatchPercentage', message: 'Employer match percentage should be greater than 0'})
                }
                const employerMatchLimit = this.getEmployerMatchLimit();
                if (this.getConfig().elective_contribution_strategy === 'until_company_match') {
                    employerContribution = employerMatchLimit
                } else {
                    electiveContribution = this.orchestrator.requestFunds(this.calculateElectiveContribution(), FundType.Taxable)
                    const employerMatch = electiveContribution * ((this.config.employer_match_percentage ?? 0) / 100);
                    employerContribution = Math.min(employerMatch, employerMatchLimit)
                }
                break

            case 'fixed':
                employerContribution = this.config.employer_contribution_fixed_amount ?? 0
                break

            case 'percentage_of_compensation':
                if (this.incomeManager === undefined) {
                    eventBus.emit('error', {
                        scope: 'taxDeferredManager:missingIncomeManager',
                        message: 'Cannot perform percentage of compensation without a lined income manager'
                    })
                    return 0
                }
                employerContribution = this.incomeManager.getCurrentState().gross_income * ((this.config.employer_compensation_match_percentage ?? 0) / 100)
                break
        }
        return employerContribution
    }


    private getEmployerMatchLimit(): number {
        if (this.incomeManager === undefined) {
            eventBus.emit('error', {
                scope: 'taxDeferredManager:missingIncomeManager',
                message: 'Cannot perform percentage of income without a lined income manager'
            })
            return 0
        }
        return this.incomeManager.getCurrentState().gross_income * (this.config.employer_match_percentage_limit ?? 0) / 100;
    }

    createNextState(previousState: TaxDeferredState): TaxDeferredState {
        assertDefined(previousState.balance_end_of_year, 'previousState.balanceEndOfYear')
        return {
            contribution: undefined,
            contribution_lifetime: previousState.contribution_lifetime,
            elective_contribution: undefined,
            elective_contribution_lifetime: previousState.elective_contribution_lifetime,
            employer_contribution: undefined,
            employer_contribution_lifetime: previousState.employer_contribution_lifetime,
            growth_amount: undefined,
            growth_lifetime: previousState.growth_lifetime,
            balance_start_of_year: previousState.balance_end_of_year,
            balance_end_of_year: undefined,
            processed: false,
        };
    }

    getContributionsAdjustedForLimits(electiveContribution: number, employerContribution: number): {
        electiveContribution: number,
        employerContribution: number,
        contribution: number,

    } {
        const electiveContributionLimit = Math.min(this.orchestrator.getLimitForContributionType(ContributionLimitType.Elective), electiveContribution)
        const contribution = Math.min(this.orchestrator.getLimitForContributionType(ContributionLimitType.Deferred), employerContribution + electiveContribution)
        const employerContributionLimit = Math.min(contribution - electiveContributionLimit, employerContribution)
        return {electiveContribution: electiveContributionLimit, employerContribution: employerContributionLimit, contribution: employerContributionLimit + electiveContributionLimit}
    }


    processImplementation(): void {
        const currentState = this.getCurrentState()
        const employerContributionRequest = this.calculateEmployerContribution()
        const electiveContributionRequest = this.calculateElectiveContribution();
        const electiveContributionReturned = this.orchestrator.requestFunds(electiveContributionRequest, FundType.Taxable)
        const {contribution, employerContribution, electiveContribution} = this.getContributionsAdjustedForLimits(electiveContributionReturned, employerContributionRequest)

        this.orchestrator.withdraw(electiveContribution, FundType.Taxable)
        const growthAmount = calculateGrowthAmount(
            currentState.balance_start_of_year,
            this.config.growth_rate,
            this.orchestrator.getConfig().growth_application_strategy,
            contribution
        )
        this.orchestrator.contribute(contribution, ContributionType.TaxDeferred)
        this.orchestrator.invest(growthAmount + contribution, ContributionType.TaxDeferred)
        const balanceEndOfYear = currentState.balance_start_of_year + growthAmount + contribution

        this.updateCurrentState(
            {
                ...currentState,
                contribution: electiveContribution + employerContribution,
                contribution_lifetime: currentState.contribution_lifetime + electiveContribution + employerContribution,
                elective_contribution: electiveContribution,
                elective_contribution_lifetime: currentState.elective_contribution_lifetime + electiveContribution,
                employer_contribution: employerContribution,
                employer_contribution_lifetime: currentState.employer_contribution_lifetime + employerContribution,
                growth_amount: growthAmount,
                growth_lifetime: currentState.growth_lifetime + growthAmount,
                balance_end_of_year: balanceEndOfYear,
            }
        )

    }
}