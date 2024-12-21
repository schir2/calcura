import type {TaxDeferredInvestment} from './TaxDeferredInvestment';
import {EmployerContributionStrategy, TaxDeferredContributionStrategy} from "./TaxDeferredInvestment";
import {assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import type TaxDeferredInvestmentState from "~/models/taxDeferredInvestment/TaxDeferredInvestmentState";
import BaseManager from "~/models/common/BaseManager";
import type Command from "~/models/common/Command";
import type IncomeManager from "~/models/income/IncomeManager";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionType} from "~/models/common";
import {ProcessTaxDeferredInvestmentCommand} from "~/models/taxDeferredInvestment/TaxDeferredInvestmentCommand";
import {ValueError} from "~/utils/errors/ValueError";

export default class TaxDeferredInvestmentManager extends BaseManager<TaxDeferredInvestment, TaxDeferredInvestmentState> {

    protected createInitialState(): TaxDeferredInvestmentState {
        return {
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

    get incomeManager(): IncomeManager {
        if (this.config.income === undefined) {
            throw new Error("Missing income configuration");
        }
        return this.orchestrator.getIncomeManagerById(this.config.income.id)
    }

    calculateElectiveContribution(): number {
        let contribution = 0
        switch (this.config.electiveContributionStrategy) {
            case TaxDeferredContributionStrategy.Fixed:
                contribution = this.config.electiveContributionFixedAmount
                break
            case TaxDeferredContributionStrategy.PercentageOfIncome:
                if (this.incomeManager === undefined) {
                    throw new Error('Cannot perform percentage of income without a lined income manager')
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
                    throw new ValueError('Cannot perform percentage of income without a linked income manager')
                }
                if (this.getConfig().employerMatchPercentage <= 0) {
                    throw new ValueError('Employer match percentage must be greater than 0')
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
                    throw new Error('Cannot perform percentage of income without a lined income manager')
                }
                employerContribution = this.incomeManager.getCurrentState().grossIncome * (this.config.employerCompensationMatchPercentage / 100)
                break
        }
        return employerContribution
    }


    private getEmployerMatchLimit(): number {
        if (this.incomeManager === undefined) {
            throw new Error('Cannot perform percentage of income without a lined income manager')
        }
        return this.incomeManager.getCurrentState().grossIncome * this.config.employerMatchPercentageLimit / 100;
    }

    createNextState(previousState: TaxDeferredInvestmentState): TaxDeferredInvestmentState {
        assertDefined(previousState.balanceEndOfYear, 'previousState.balanceEndOfYear')
        return {
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

    getCommands(): Command[] {
        return [new ProcessTaxDeferredInvestmentCommand(this)];
    }


    processImplementation(): void {
        const currentState = this.getCurrentState()
        let employerContribution = this.calculateEmployerContribution()
        const electiveContributionRequest = this.calculateElectiveContribution();
        const electiveContribution = this.orchestrator.requestFunds(electiveContributionRequest, FundType.Taxable)
        const contribution = electiveContribution + employerContribution
        const growthAmount = calculateInvestmentGrowthAmount(
            currentState.balanceStartOfYear,
            this.config.growthRate,
            this.orchestrator.getConfig().growthApplicationStrategy,
            contribution
        )
        console.log(growthAmount)
        this.orchestrator.contribute(growthAmount + contribution, ContributionType.TaxDeferred)
        const balanceEndOfYear = currentState.balanceStartOfYear + growthAmount + contribution

        this.updateCurrentState(
            {
                ...currentState,
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