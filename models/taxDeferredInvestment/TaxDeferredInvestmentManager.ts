import type {TaxDeferredInvestment} from './TaxDeferredInvestment';
import {adjustForAllowNegativeDisposableIncome, assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import {type AllowNegativeDisposableIncome, GrowthApplicationStrategy} from "~/models/plan/Plan";
import type TaxDeferredInvestmentState from "~/models/taxDeferredInvestment/TaxDeferredInvestmentState";
import ManagerBase from "~/models/common/ManagerBase";
import type {PlanState} from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";

export default class TaxDeferredInvestmentManager extends ManagerBase<TaxDeferredInvestment, TaxDeferredInvestmentState> {

    calculateElectiveContribution(
        limit: number,
        disposableIncome: number,
        incomePreTaxed?: number,
        employerMatchLimit: number = 0,
        allowNegativeDisposableIncome: AllowNegativeDisposableIncome = 'none'
    ): number {
        let contribution = 0
        switch (this.config.electiveContributionStrategy) {
            case 'fixed':
                contribution = this.config.electiveContributionFixedAmount
                break
            case 'percentage_of_income':
                assertDefined(incomePreTaxed, 'incomePreTaxed')
                contribution = incomePreTaxed * (this.config.electiveContributionPercentage / 100)
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
                disposableIncome: disposableIncome,
                allowNegativeDisposableIncome: allowNegativeDisposableIncome
            }
        )
    }

    calculateEmployerContribution(
        limit: number,
        disposableIncome: number,
        incomePreTaxed?: number,
        employerMatchLimit: number = 0,
        allowNegativeDisposableIncome: AllowNegativeDisposableIncome = 'none'
    ): number {
        let employerContribution = 0
        const electiveContribution = this.calculateElectiveContribution(
            limit, disposableIncome, incomePreTaxed, employerMatchLimit, allowNegativeDisposableIncome
        )

        switch (this.config.employerContributionStrategy) {
            case 'none':
                break
            case "percentage_of_contribution":
                assertDefined(incomePreTaxed, 'incomePreTaxed')
                const employerMatch = electiveContribution * (this.config.employerMatchPercentage / 100);
                const maxEmployerMatch = incomePreTaxed * this.config.employerMatchPercentageLimit / 100;
                employerContribution = Math.min(employerMatch, maxEmployerMatch)
                break
            case "fixed":
                employerContribution = this.config.employerContributionFixedAmount
                break
            case "percentage_of_compensation":
                assertDefined(incomePreTaxed, 'incomePreTaxed')
                employerContribution = incomePreTaxed * (this.config.employerCompensationMatchPercentage / 100)
                break
        }
        return Math.min(employerContribution, limit - electiveContribution)

    }

    calculateGrowthAmount(state:TaxDeferredInvestmentState, growthApplicationStrategy: GrowthApplicationStrategy): number {
        return calculateInvestmentGrowthAmount({
                principal: state.balanceStartOfYear,
                growthRate: this.config.growthRate,
                growthApplicationStrategy: growthApplicationStrategy,
                contribution: state.electiveContribution
            }
        )
    }

    protected createInitialState(): TaxDeferredInvestmentState {
        return undefined;
    }

    protected createNextState(previousState: TaxDeferredInvestmentState): TaxDeferredInvestmentState {
        return undefined;
    }

    getCommands(): Command[] {
        return [];
    }

    processImplementation(planState: PlanState): PlanState {
        const currentState = this.getCurrentState()
        const electiveContribution = currentState.electiveContribution ?? this.calculateElectiveContribution(...planState);
        if (currentState.electiveContribution === undefined) {}
    }
}
