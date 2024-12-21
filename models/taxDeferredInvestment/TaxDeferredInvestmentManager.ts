import type {TaxDeferredInvestment} from './TaxDeferredInvestment';
import {TaxDeferredContributionStrategy} from "./TaxDeferredInvestment";
import {assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import type TaxDeferredInvestmentState from "~/models/taxDeferredInvestment/TaxDeferredInvestmentState";
import BaseManager from "~/models/common/BaseManager";
import type Command from "~/models/common/Command";
import type IncomeManager from "~/models/income/IncomeManager";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionType} from "~/models/common";
import {ProcessTaxDeferredInvestmentCommand} from "~/models/taxDeferredInvestment/TaxDeferredInvestmentCommand";

export default class TaxDeferredInvestmentManager extends BaseManager<TaxDeferredInvestment, TaxDeferredInvestmentState> {

    incomeManager?: IncomeManager = undefined

    protected createInitialState(): TaxDeferredInvestmentState {
        return {
            electiveContribution: undefined,
            electiveContributionLifetime: 0,
            employerContribution: undefined,
            employerContributionLifetime: 0,
            growthAmount: 0,
            growthLifetime: 0,
            balanceStartOfYear: this.config.initialBalance,
            balanceEndOfYear: undefined,
            processed: false
        };
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
                contribution = this.getEmployerContribution()
                break
            case TaxDeferredContributionStrategy.Max:
                contribution = Infinity
                break
            default:
                throw new Error(`Invalid elective contribution strategy ${this.config.electiveContributionStrategy || 'blank'}`)
        }
        return contribution
    }

    getEmployerContribution(): number {
        let employerContribution = 0
        let electiveContribution = 0

        switch (this.config.employerContributionStrategy) {
            case 'none':
                break
            case "percentage_of_contribution":
                if (this.incomeManager === undefined) {
                    throw new Error('Cannot perform percentage of income without a lined income manager')
                }
                electiveContribution = this.orchestrator.requestFunds(this.calculateElectiveContribution(), FundType.Taxable)
                const employerMatch = electiveContribution * (this.config.employerMatchPercentage / 100);
                const maxEmployerMatch = this.incomeManager.getCurrentState().grossIncome * this.config.employerMatchPercentageLimit / 100;
                employerContribution = Math.min(employerMatch, maxEmployerMatch)
                break
            case "fixed":
                employerContribution = this.orchestrator.requestFunds(this.config.employerContributionFixedAmount, FundType.Taxable)
                break
            case "percentage_of_compensation":
                if (this.incomeManager === undefined) {
                    throw new Error('Cannot perform percentage of income without a lined income manager')
                }
                employerContribution = this.incomeManager.getCurrentState().grossIncome * (this.config.employerCompensationMatchPercentage / 100)
                break
        }
        return employerContribution
    }


    createNextState(previousState: TaxDeferredInvestmentState): TaxDeferredInvestmentState {
        assertDefined(previousState.balanceEndOfYear, 'previousState.balanceEndOfYear')
        return {
            electiveContribution: undefined,
            electiveContributionLifetime: previousState.electiveContributionLifetime,
            employerContribution: undefined,
            employerContributionLifetime: previousState.employerContributionLifetime,
            growthAmount: 0,
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
        const employerContribution = this.getEmployerContribution()
        const electiveContributionRequest = this.calculateElectiveContribution();
        const electiveContribution = this.orchestrator.requestFunds(electiveContributionRequest, FundType.Taxable)
        const contribution = electiveContribution + employerContribution
        const growthAmount = calculateInvestmentGrowthAmount(
            currentState.balanceStartOfYear,
            this.config.growthRate,
            this.orchestrator.getConfig().growthApplicationStrategy,
            contribution
        )
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
                balanceEndOfYear: balanceEndOfYear,
            }
        )

    }
}