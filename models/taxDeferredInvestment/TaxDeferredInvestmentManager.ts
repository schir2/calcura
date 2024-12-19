import type {TaxDeferredInvestment} from './TaxDeferredInvestment';
import {adjustForAllowNegativeDisposableIncome, assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import type {AllowNegativeDisposableIncome, GrowthApplicationStrategy, IncomeTaxStrategy} from "~/models/plan/Plan";
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
            employerContribution: undefined,
            growthAmount: 0,
            balanceStartOfYear: this.config.initialBalance,
            balanceEndOfYear: undefined,
            processed: false
        };
    }

    calculateElectiveContribution(
        limit: number,
        taxableIncome: number,
        taxedIncome: number,
        employerMatchLimit: number = 0,
        allowNegativeDisposableIncome: AllowNegativeDisposableIncome = 'none',

    ): number {
        let contribution = 0
        switch (this.config.electiveContributionStrategy) {
            case 'fixed':
                contribution = this.config.electiveContributionFixedAmount
                break
            case 'percentage_of_income':
                assertDefined(taxableIncome, 'incomePreTaxed')
                contribution = taxableIncome * (this.config.electiveContributionPercentage / 100)
                break
            case 'until_company_match':
                contribution = employerMatchLimit
                break
            case "max":
                contribution = limit
                break
        }
        return adjustForAllowNegativeDisposableIncome(
            {
                amount: contribution,
                disposableIncome: taxedIncome,
                allowNegativeDisposableIncome: allowNegativeDisposableIncome
            }
        )
    }

    getEmployerContribution(
        limit: number,
        taxableIncome: number,
        taxedIncome: number,
        employerMatchLimit: number = 0,
        allowNegativeDisposableIncome: AllowNegativeDisposableIncome = 'none'
    ): number {
        let employerContribution = 0
        const electiveContribution = this.calculateElectiveContribution(
            limit, taxableIncome, taxedIncome, employerMatchLimit, allowNegativeDisposableIncome
        )

        switch (this.config.employerContributionStrategy) {
            case 'none':
                break
            case "percentage_of_contribution":
                assertDefined(taxableIncome, 'incomePreTaxed')
                const employerMatch = electiveContribution * (this.config.employerMatchPercentage / 100);
                const maxEmployerMatch = taxableIncome * this.config.employerMatchPercentageLimit / 100;
                employerContribution = Math.min(employerMatch, maxEmployerMatch)
                break
            case "fixed":
                employerContribution = this.config.employerContributionFixedAmount
                break
            case "percentage_of_compensation":
                assertDefined(taxableIncome, 'incomePreTaxed')
                employerContribution = taxableIncome * (this.config.employerCompensationMatchPercentage / 100)
                break
        }
        return Math.min(employerContribution, limit - electiveContribution)

    }

    calculateGrowthAmount(balanceStartOfYear: number, contribution:number, growthApplicationStrategy: GrowthApplicationStrategy): number {
        return calculateInvestmentGrowthAmount({
                principal: balanceStartOfYear,
                growthRate: this.config.growthRate,
                growthApplicationStrategy: growthApplicationStrategy,
                contribution: contribution
            }
        )
    }

    protected createNextState(previousState: TaxDeferredInvestmentState): TaxDeferredInvestmentState {
        assertDefined(previousState.balanceEndOfYear, 'previousState.balanceEndOfYear')
        return {
            electiveContribution: undefined,
            employerContribution: undefined,
            growthAmount: 0,
            balanceStartOfYear: previousState.balanceEndOfYear,
            balanceEndOfYear: undefined,
            processed: false,
        };
    }

    getCommands(): Command[] {
        return [];
    }

    getEmployerMatchLimit(): number {
        if (this.incomeManager === undefined) {
            return 0
        }
        return this.config.employerMatchPercentageLimit / 100 * this.incomeManager.getCurrentState().grossIncome
    }

    processImplementation(planState: PlanState): PlanState {
        const currentState = this.getCurrentState()
        const employerMatchLimit = this.getEmployerMatchLimit()
        const electiveContribution = this.calculateElectiveContribution(
            planState.electiveLimit,
            planState.taxableIncome,
            planState.taxedIncome,
            employerMatchLimit,
            planState.allowNegativeDisposableIncome
        );
        const employerContribution = this.getEmployerContribution(
            planState.deferredLimit - electiveContribution,
            planState.taxableIncome,
            planState.taxedIncome,
            employerMatchLimit,
            planState.allowNegativeDisposableIncome)

        const growthAmount = this.calculateGrowthAmount(
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
    switch (planState.taxStrategy){
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