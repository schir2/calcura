import type {AllowNegativeDisposableIncome, InvestmentGrowthApplicationStrategy} from "~/types";
import {adjustContributionForDisposableIncome, assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import {DEFAULT_GROWTH_APPLICATION_STRATEGY, DEFAULT_INVESTMENT_GROWTH_RATE} from "~/constants/financial";
import type {EmployerContributionStrategy} from "~/constants/employerContribution";
import type {TaxDeferredContributionStrategy} from "~/constants/taxDeferred";
import {DEFAULT_EMPLOYER_CONTRIBUTES, TAX_DEFERRED_INVESTMENT_TEMPLATE} from "~/constants/taxDeferred";
import {RETIREMENT_TEMPLATE} from "~/constants/retirement";

export interface TaxDeferredInvestmentData {
    name: string;

    growthApplicationStrategy: InvestmentGrowthApplicationStrategy
    growthRate: number;
    balance: number;

    electiveContributionStrategy: TaxDeferredContributionStrategy;
    electiveContributionPercentage: number;
    electiveContributionFixedAmount: number;

    employerContributes: boolean;
    employerContributionStrategy: EmployerContributionStrategy;
    employerCompensationMatchPercentage: number;
    employerContributionFixedAmount: number;
    employerMatchPercentage: number;
    employerMatchPercentageLimit: number;

}

export default class TaxDeferredInvestment {
    name: string;
    growthApplicationStrategy: InvestmentGrowthApplicationStrategy = 'start'
    growthRate: number;

    // Elective Input Fields
    electiveContributionStrategy: TaxDeferredContributionStrategy;
    electiveContributionFixedAmount: number;
    electiveContributionPercentage: number;

    // Employer Input Fields
    employerContributes: boolean = false;
    employerContributionStrategy: EmployerContributionStrategy;
    employerContributionFixedAmount: number;
    employerMatchPercentage: number;
    employerMatchPercentageLimit: number;
    employerContributionPercentage: number;

    // Calculated Fields
    electiveContribution: number = 0;
    employerContribution: number = 0;
    electiveContributionLifetime: number = 0;
    employerContributionLifetime: number = 0;

    growthAmount?: number;
    balanceStartOfYear: number;
    balanceEndOfYear?: number;


    constructor(data: TaxDeferredInvestmentData) {
        this.name = data.name;
        this.balanceStartOfYear = data.balance ?? 0;
        this.growthRate = data.growthRate ?? DEFAULT_INVESTMENT_GROWTH_RATE;
        this.growthApplicationStrategy = data.growthApplicationStrategy ?? DEFAULT_GROWTH_APPLICATION_STRATEGY;

        this.electiveContributionStrategy = data.electiveContributionStrategy;
        this.electiveContributionFixedAmount = data.electiveContributionFixedAmount;
        this.electiveContributionPercentage = data.electiveContributionPercentage;

        this.employerContributes = data.employerContributes ?? DEFAULT_EMPLOYER_CONTRIBUTES
        this.employerContributionStrategy = data.employerContributionStrategy
        this.employerContributionPercentage = data.employerCompensationMatchPercentage
        this.employerContributionFixedAmount = data.employerContributionFixedAmount
        this.employerMatchPercentage = data.employerMatchPercentage
        this.employerMatchPercentageLimit = data.employerMatchPercentageLimit

    }

    static defaultValues(template?: keyof typeof TAX_DEFERRED_INVESTMENT_TEMPLATE): TaxDeferredInvestmentData {
        return TAX_DEFERRED_INVESTMENT_TEMPLATE[template ?? 'default']
    }

    calculateElectiveContribution(
        limit: number,
        disposableIncome: number,
        incomePreTaxed?: number,
        employerMatchLimit: number = 0,
        allowNegativeDisposableIncome: AllowNegativeDisposableIncome = 'none'
    ): number {
        let contribution = 0
        switch (this.electiveContributionStrategy) {
            case 'fixed':
                contribution = this.electiveContributionFixedAmount
                break
            case 'percent_of_income':
                assertDefined(incomePreTaxed, 'incomePreTaxed')
                contribution = incomePreTaxed * (this.electiveContributionPercentage / 100)
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
        allowNegativeDisposableIncome: AllowNegativeDisposableIncome = 'none'
    ): number {
        let employerContribution = 0
        const electiveContribution = this.calculateElectiveContribution(
            limit, disposableIncome, incomePreTaxed, employerMatchLimit, allowNegativeDisposableIncome
        )

        switch (this.employerContributionStrategy) {
            case 'none':
                break
            case "percentage_of_contribution":
                assertDefined(incomePreTaxed, 'incomePreTaxed')
                const employerMatch = electiveContribution * (this.employerMatchPercentage / 100);
                const maxEmployerMatch = incomePreTaxed * this.employerMatchPercentageLimit / 100;
                employerContribution = Math.min(employerMatch, maxEmployerMatch)
                break
            case "fixed":
                employerContribution = this.employerContributionFixedAmount
                break
            case "percentage_of_compensation":
                assertDefined(incomePreTaxed, 'incomePreTaxed')
                employerContribution = incomePreTaxed * (this.employerContributionPercentage / 100)
                break
        }
        return Math.min(employerContribution, limit - electiveContribution)

    }

    calculateGrowthAmount(): number {
        return calculateInvestmentGrowthAmount({
                principal: this.balanceStartOfYear,
                growthRate: this.growthRate,
                growthApplicationStrategy: this.growthApplicationStrategy,
                contribution: this.electiveContribution
            }
        )
    }


}