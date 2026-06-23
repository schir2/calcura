import {
    HSA_CATCH_UP_AGE,
    HSA_CONTRIBUTION_CATCH_UP_LIMIT_2024,
    HSA_CONTRIBUTION_LIMIT_2024,
    HSA_DEFAULT_YEAR,
    HSA_LIMIT_INFLATION_RATE
} from "~/constants/HsaConstants";
import {calculateCompoundInterest} from "~/utils/financial";

export function getHsaLimit(year: number, age: number): number {
    const baseLimit = age >= HSA_CATCH_UP_AGE
        ? HSA_CONTRIBUTION_CATCH_UP_LIMIT_2024
        : HSA_CONTRIBUTION_LIMIT_2024
    return calculateCompoundInterest(baseLimit, HSA_LIMIT_INFLATION_RATE / 100, 1, year - HSA_DEFAULT_YEAR)
}