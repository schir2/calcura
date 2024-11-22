import TaxDeferredInvestmentConfig from './TaxDeferredInvestmentConfig';
import {adjustContributionForDisposableIncome, assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import {AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";
import {TaxDeferredInvestmentState} from "~/models/taxDeferred/TaxDeferredInvestmentState";

export class TaxDeferredInvestmentService {
    config: TaxDeferredInvestmentConfig;
    states: TaxDeferredInvestmentState[]

    constructor(config: TaxDeferredInvestmentConfig) {
        this.config = config;
        this.states = [];
    }


    calculateElectiveContribution(
        limit: number,
        disposableIncome: number,
        incomePreTaxed?: number,
        employerMatchLimit: number = 0,
        allowNegativeDisposableIncome: AllowNegativeDisposableIncome = AllowNegativeDisposableIncome.none
    ): number {
        let contribution = 0
        switch (this.config.electiveContributionStrategy) {
            case 'fixed':
                contribution = this.config.electiveContributionFixedAmount
                break
            case 'percent_of_income':
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
        return adjustContributionForDisposableIncome(
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
        allowNegativeDisposableIncome: AllowNegativeDisposableIncome = AllowNegativeDisposableIncome.none
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
                employerContribution = incomePreTaxed * (this.config.employerContributionPercentage / 100)
                break
        }
        return Math.min(employerContribution, limit - electiveContribution)

    }

    calculateGrowthAmount(): number {
        return calculateInvestmentGrowthAmount({
                principal: this.balanceStartOfYear,
                growthRate: this.config.growthRate,
                growthApplicationStrategy: this.config.growthApplicationStrategy,
                contribution: this.electiveContribution
            }
        )
    }
}
