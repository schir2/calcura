import type {AllowNegativeDisposableIncome, ContributionStrategy, InvestmentGrowthApplicationStrategy} from "~/types";
import {assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import {DEFAULT_GROWTH_APPLICATION_STRATEGY, DEFAULT_INVESTMENT_GROWTH_RATE} from "~/constants/financial";

export interface TaxDeferredInvestmentData {
    balance: number;
    contributionStrategy: ContributionStrategy;
    contributionPercentage: number;
    contributionFixedAmount: number;
    growthApplicationStrategy?: InvestmentGrowthApplicationStrategy
    growthRate: number;

}

export default class TaxDeferredInvestment {
    balanceStartOfYear: number;
    balanceEndOfYear?: number;
    contributionStrategy: ContributionStrategy;

    contributionFixedAmount: number;
    contribution?: number;
    growthAmount?: number;
    growthApplicationStrategy: InvestmentGrowthApplicationStrategy = 'start'
    contributionPercentage: number;
    growthRate: number;
    contributionLifetime: number = 0;

    constructor(data: TaxDeferredInvestmentData) {
        this.balanceStartOfYear = data.balance;
        this.contributionStrategy = data.contributionStrategy;
        this.contributionFixedAmount = data.contributionFixedAmount;
        this.contributionPercentage = data.contributionPercentage;
        this.growthRate = data.growthRate ?? DEFAULT_INVESTMENT_GROWTH_RATE;
        this.growthApplicationStrategy = data.growthApplicationStrategy ?? DEFAULT_GROWTH_APPLICATION_STRATEGY;

    }

    calculateContribution(
        limit: number,
        disposableIncome: number,
        incomePreTaxed?: number,
        employerMatchLimit: number = 0,
        allowNegativeDisposableIncome: AllowNegativeDisposableIncome = 'none'
    ): number {
        let contribution = 0
        switch (this.contributionStrategy) {
            case 'fixed':
                contribution = this.contributionFixedAmount
                break
            case 'percent_of_income':
                assertDefined(incomePreTaxed, 'incomePreTaxed')
                contribution = incomePreTaxed * (this.contributionPercentage / 100)
                break
            case 'until_company_match':
                contribution = employerMatchLimit
                break
            case "max":
                contribution = limit
                break
        }
        contribution = Math.min(contribution, limit)

        switch (allowNegativeDisposableIncome) {
            case 'none':
                return Math.min(contribution, disposableIncome)
            case "minimum_only":
                return Math.min(contribution, disposableIncome)
            case 'full':
                return contribution
        }

    }

    calculateGrowthAmount(): number {
        return calculateInvestmentGrowthAmount({
                principal: this.balanceStartOfYear,
                growthRate: this.growthRate,
                growthApplicationStrategy: this.growthApplicationStrategy,
                contribution: this.contribution
            }
        )
    }


}