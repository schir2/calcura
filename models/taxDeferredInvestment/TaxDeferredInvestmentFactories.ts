import type {TaxDeferredInvestmentPartial} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import {
    DEFAULT_ELECTIVE_CONTRIBUTION_PERCENTAGE,
    DEFAULT_ELECTIVE_CONTRIBUTION_STRATEGY,
    DEFAULT_EMPLOYER_CONTRIBUTES,
    DEFAULT_EMPLOYER_CONTRIBUTION_STRATEGY,
    DEFAULT_EMPLOYER_MATCH_PERCENTAGE,
    DEFAULT_EMPLOYER_MATCH_PERCENTAGE_LIMIT,
    DEFAULT_TAX_DEFERRED_GROWTH_RATE,
    TAX_DEFERRED_DEFAULT_BALANCE
} from "~/models/taxDeferredInvestment/TaxDeferredInvestmentConstants";

export function defaultTaxDeferredInvestmentFactory(): TaxDeferredInvestmentPartial {
    return {
        name: '401k',

        growthRate: DEFAULT_TAX_DEFERRED_GROWTH_RATE,
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
