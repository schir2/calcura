import type {TaxDeferredInvestmentConfig} from "~/models/taxDeferred/TaxDeferredInvestmentConfig";
import {
    DEFAULT_DAX_DEFERRED_GROWTH_RATE,
    DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE,
    DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY,
    DEFAULT_EMPLOYER_CONTRIBUTES,
    DEFAULT_EMPLOYER_CONTRIBUTION_STRATEGY,
    DEFAULT_EMPLOYER_MATCH_PERCENTAGE,
    DEFAULT_EMPLOYER_MATCH_PERCENTAGE_LIMIT,
    TAX_DEFERRED_DEFAULT_BALANCE
} from "~/models/taxDeferred/TaxDeferredInvestmentConstants";
import {DEFAULT_GROWTH_APPLICATION_STRATEGY} from "~/models/plan/PlanConstants";

export function defaultTaxDeferredInvestmentFactory(): TaxDeferredInvestmentConfig {
    return {
        name: '401k',

        growthApplicationStrategy: DEFAULT_GROWTH_APPLICATION_STRATEGY,
        growthRate: DEFAULT_DAX_DEFERRED_GROWTH_RATE,
        initialBalance: TAX_DEFERRED_DEFAULT_BALANCE,

        electiveContributionStrategy: DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY,
        electiveContributionPercentage: DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE,
        electiveContributionFixedAmount: 0,

        employerContributes: DEFAULT_EMPLOYER_CONTRIBUTES,
        employerContributionStrategy: DEFAULT_EMPLOYER_CONTRIBUTION_STRATEGY,
        employerMatchPercentage: DEFAULT_EMPLOYER_MATCH_PERCENTAGE,
        employerMatchPercentageLimit: DEFAULT_EMPLOYER_MATCH_PERCENTAGE_LIMIT,
        employerContributionFixedAmount: 0,
        employerCompensationMatchPercentage: 0,

    }
}
