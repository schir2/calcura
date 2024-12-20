import type {TaxDeferredInvestment} from './TaxDeferredInvestment';
import {TaxDeferredContributionStrategy} from "./TaxDeferredInvestment";
import {assertDefined} from "~/utils";
import type TaxDeferredInvestmentState from "~/models/taxDeferredInvestment/TaxDeferredInvestmentState";
import BaseManager from "~/models/common/BaseManager";
import type {PlanState} from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";
import type IncomeManager from "~/models/income/IncomeManager";

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
                electiveContribution = this.calculateElectiveContribution()
                const employerMatch = electiveContribution * (this.config.employerMatchPercentage / 100);
                const maxEmployerMatch = this.incomeManager.getCurrentState().grossIncome * this.config.employerMatchPercentageLimit / 100;
                employerContribution = Math.min(employerMatch, maxEmployerMatch)
                break
            case "fixed":
                employerContribution = this.config.employerContributionFixedAmount
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
            electiveContributionLifetime: previousState.electiveContributionLifetime + previousState.electiveContribution,
            employerContribution: undefined,
            employerContributionLifetime: previousState.employerContributionLifetime + previousState.employerContribution,
            growthAmount: 0,
            growthLifetime: previousState.growthLifetime + previousState.growthAmount,
            balanceStartOfYear: previousState.balanceEndOfYear,
            balanceEndOfYear: undefined,
            processed: false,
        };
    }

    getCommands(): Command[] {
        return [];
    }


    processImplementation(): void {
        const currentState = this.getCurrentState()
        const electiveContribution = this.calculateElectiveContribution();
        const employerContribution = this.getEmployerContribution()

        const growthAmount = calculateGrowthAmount(
            currentState.balanceStartOfYear,
            employerContribution + electiveContribution,
            planState.growthApplicationStrategy
        )
        const balanceEndOfYear = currentState.balanceStartOfYear + growthAmount

        this.updateCurrentState(
            {
                ...currentState,
                electiveContribution: electiveContribution,
                employerContribution: employerContribution,
                growthAmount: growthAmount,
                balanceEndOfYear: balanceEndOfYear,
            }
        )

        const taxableIncome = planState.taxableIncome - electiveContribution;
        return {
            ...planState,
            taxableIncome: taxableIncome,
            taxedIncome: recalculateTaxedIncome(planState, electiveContribution)
        }

    }
}


function recalculateTaxedIncome(planState: PlanState, amount: number): number {
    switch (planState.taxStrategy) {
        case "simple":
            return amount * (1 - planState.taxRate / 100)
    }
}

function maxTaxDeferredContribution(
    taxableIncome: number,
    taxedIncome: number,
    taxRate: number
): number {
    const numerator = taxableIncome * (1 - taxRate) + taxedIncome;
    const denominator = (1 - taxRate);

    const maxContribution = numerator / denominator;

    return Math.max(0, maxContribution);
}