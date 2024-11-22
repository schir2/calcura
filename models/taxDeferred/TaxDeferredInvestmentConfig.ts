import type {InvestmentGrowthApplicationStrategy} from "~/types";
import {DEFAULT_GROWTH_APPLICATION_STRATEGY, DEFAULT_INVESTMENT_GROWTH_RATE} from "~/constants/financial";
import type {EmployerContributionStrategy, TaxDeferredContributionStrategy} from "~/models/taxDeferred/TaxDeferredInvestmentConstants";
import {DEFAULT_EMPLOYER_CONTRIBUTES, TAX_DEFERRED_INVESTMENT_TEMPLATE} from "~/models/taxDeferred/TaxDeferredInvestmentConstants";


export interface TaxDeferredInvestmentConfigData {
    name: string;

    growthApplicationStrategy: InvestmentGrowthApplicationStrategy
    growthRate: number;
    initialBalance: number;

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

export default class TaxDeferredInvestmentConfig {
    name: string;
    initialBalance: number
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


    constructor(data: TaxDeferredInvestmentConfigData) {
        this.name = data.name;
        this.initialBalance = data.initialBalance ?? 0;
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

    static defaultValues(template?: keyof typeof TAX_DEFERRED_INVESTMENT_TEMPLATE): TaxDeferredInvestmentConfigData {
        return TAX_DEFERRED_INVESTMENT_TEMPLATE[template ?? 'default']
    }


}