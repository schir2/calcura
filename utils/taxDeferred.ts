import {calculateCompoundInterest} from "./financial";

import {
    TAX_DEFERRED_CONTRIBUTION_LIMIT_2025,
    TAX_DEFERRED_DEFAULT_YEAR,
    TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2025,
    TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2025,
    TAX_DEFERRED_LIMIT_INFLATION_RATE
} from "~/constants/TaxDeferredConstants";


export function getTaxDeferredContributionLimit(year: number, age: number): number {
    return calculateCompoundInterest(
        TAX_DEFERRED_CONTRIBUTION_LIMIT_2025,
        TAX_DEFERRED_LIMIT_INFLATION_RATE / 100,
        1,
        year - TAX_DEFERRED_DEFAULT_YEAR
    )

}

export function getTaxDeferredElectiveContributionLimit(year: number, age: number): number {
    return calculateCompoundInterest(
        TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2025,
        TAX_DEFERRED_LIMIT_INFLATION_RATE / 100,
        1,
        year - TAX_DEFERRED_DEFAULT_YEAR
    )

}

export function getTaxDeferredElectiveContributionCatchUpLimit(year: number): number {
    return calculateCompoundInterest(
        TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2025,
        TAX_DEFERRED_LIMIT_INFLATION_RATE / 100,
        1,
        year - TAX_DEFERRED_DEFAULT_YEAR
    )

}

