import type {TaxDeferred} from '~/types/TaxDeferred';
import {EmployerContributionStrategy, TaxDeferredContributionStrategy} from "~/types/TaxDeferred";
import {assertDefined, calculateGrowthAmount} from "~/utils";
import type TaxDeferredState from "~/types/TaxDeferredState";
import BaseManager from "~/models/common/BaseManager";
import type {IncomeManager} from "~/constants/IncomeManager";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionType} from "~/models/common";
import {ContributionLimitType} from "~/types/Plan";
import eventBus from "~/services/eventBus";

export class TaxDeferredManager extends BaseManager<TaxDeferred, TaxDeferredState> {

    protected createInitialState(): TaxDeferredState {
        return {
            contribution: undefined,
            contributionLifetime: 0,
            electiveContribution: undefined,
            electiveContributionLifetime: 0,
            employerContribution: undefined,
            employerContributionLifetime: 0,
            growthAmount: undefined,
            growthLifetime: 0,
            balanceStartOfYear: this.config.initialBalance,
            balanceEndOfYear: undefined,
            processed: false
        };
    }

    get incomeManager(): IncomeManager | undefined {
        if (this.config.income) {
            return this.orchestrator.getManagerById('incomeManagers', this.config.income.id)
        }
        eventBus.emit('warning', {
            scope: 'taxDeferredManager:missingIncomeManager',
            message: 'Missing income manager'
        })
        return undefined;
    }

    calculateElectiveContribution(): number {
        let contribution = 0
        switch (this.config.electiveContributionStrategy) {
            case TaxDeferredContributionStrategy.Fixed:
                contribution = this.config.electiveContributionFixedAmount
                break
            case TaxDeferredContributionStrategy.PercentageOfIncome:
                if (this.incomeManager === undefined) {
                    eventBus.emit('error', {
                        scope: 'taxDeferredManager:missingIncomeManager',
                        message: 'Cannot perform percentage of income without a lined income manager'
                    })
                    return 0
                }
                contribution = this.incomeManager.getCurrentState().grossIncome * (this.config.electiveContributionPercentage / 100)
                break
            case TaxDeferredContributionStrategy.UntilCompanyMatch:
                if (this.config.employerContributionStrategy === EmployerContributionStrategy.PercentageOfContribution) {
                    contribution = this.getContributionFromEmployerMatchLimit(this.getEmployerMatchLimit());
                } else {
                    contribution = this.calculateEmployerContribution()
                }
                break
            case TaxDeferredContributionStrategy.Max:
                contribution = Infinity
                break
            default:

                throw new Error(`Invalid elective contribution strategy ${this.config.electiveContributionStrategy || 'blank'}`)
        }
        return contribution
    }

    private getContributionFromEmployerMatchLimit(employerMatchLimit: number) {
        if (this.config.employerMatchPercentage === 0) {
            return 0
        }
        return employerMatchLimit * 100 / this.config.employerMatchPercentage
    }

    calculateEmployerContribution(): number {
        let employerContribution = 0
        let electiveContribution = 0

        switch (this.config.employerContributionStrategy) {
            case EmployerContributionStrategy.None:
                employerContribution = 0
                break

            case EmployerContributionStrategy.PercentageOfContribution:
                if (this.incomeManager === undefined) {
                    eventBus.emit('error', {
                        scope: 'taxDeferredManager:missingIncomeManager',
                        message: 'Cannot perform percentage of income without a lined income manager'
                    })
                    return 0
                }
                if (this.getConfig().employerMatchPercentage <= 0) {

                    eventBus.emit('warning', {scope: 'calculateEmployerContribution:employerMatchPercentage', message: 'Employer match percentage should be greater than 0'})
                }
                const employerMatchLimit = this.getEmployerMatchLimit();
                if (this.getConfig().electiveContributionStrategy === TaxDeferredContributionStrategy.UntilCompanyMatch) {
                    employerContribution = employerMatchLimit
                } else {
                    electiveContribution = this.orchestrator.requestFunds(this.calculateElectiveContribution(), FundType.Taxable)
                    const employerMatch = electiveContribution * (this.config.employerMatchPercentage / 100);
                    employerContribution = Math.min(employerMatch, employerMatchLimit)
                }
                break

            case EmployerContributionStrategy.Fixed:
                employerContribution = this.config.employerContributionFixedAmount
                break

            case EmployerContributionStrategy.PercentageOfCompensation:
                if (this.incomeManager === undefined) {
                    eventBus.emit('error', {
                        scope: 'taxDeferredManager:missingIncomeManager',
                        message: 'Cannot perform percentage of compensation without a lined income manager'
                    })
                    return 0
                }
                employerContribution = this.incomeManager.getCurrentState().grossIncome * (this.config.employerCompensationMatchPercentage / 100)
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
        return this.incomeManager.getCurrentState().grossIncome * this.config.employerMatchPercentageLimit / 100;
    }

    createNextState(previousState: TaxDeferredState): TaxDeferredState {
        assertDefined(previousState.balanceEndOfYear, 'previousState.balanceEndOfYear')
        return {
            contribution: undefined,
            contributionLifetime: previousState.contributionLifetime,
            electiveContribution: undefined,
            electiveContributionLifetime: previousState.electiveContributionLifetime,
            employerContribution: undefined,
            employerContributionLifetime: previousState.employerContributionLifetime,
            growthAmount: undefined,
            growthLifetime: previousState.growthLifetime,
            balanceStartOfYear: previousState.balanceEndOfYear,
            balanceEndOfYear: undefined,
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
            currentState.balanceStartOfYear,
            this.config.growthRate,
            this.orchestrator.getConfig().growthApplicationStrategy,
            contribution
        )
        this.orchestrator.contribute(contribution, ContributionType.TaxDeferred)
        this.orchestrator.invest(growthAmount + contribution, ContributionType.TaxDeferred)
        const balanceEndOfYear = currentState.balanceStartOfYear + growthAmount + contribution

        this.updateCurrentState(
            {
                ...currentState,
                contribution: electiveContribution + employerContribution,
                contributionLifetime: currentState.contributionLifetime + electiveContribution + employerContribution,
                electiveContribution: electiveContribution,
                electiveContributionLifetime: currentState.electiveContributionLifetime + electiveContribution,
                employerContribution: employerContribution,
                employerContributionLifetime: currentState.employerContributionLifetime + employerContribution,
                growthAmount: growthAmount,
                growthLifetime: currentState.growthLifetime + growthAmount,
                balanceEndOfYear: balanceEndOfYear,
            }
        )

    }
}