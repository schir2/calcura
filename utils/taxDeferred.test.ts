import {describe, expect, it} from 'vitest';
import {
    getTaxDeferredContributionLimit,
    getTaxDeferredElectiveContributionCatchUpLimit,
    getTaxDeferredElectiveContributionLimit,
} from './taxDeferred';


import {TAX_DEFERRED_CONTRIBUTION_LIMIT_2024, TAX_DEFERRED_DEFAULT_YEAR, TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2024, TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2024, TAX_DEFERRED_LIMIT_INFLATION_RATE} from "~/models/taxDeferred/TaxDeferredInvestmentConstants";

describe('Tax Deferred Contribution Limit Calculations', () => {
    it('calculates the tax deferred contribution limit for the current year', () => {
        const result = getTaxDeferredContributionLimit(TAX_DEFERRED_DEFAULT_YEAR);
        expect(result).toBe(TAX_DEFERRED_CONTRIBUTION_LIMIT_2024);
    });

    it('calculates the tax deferred contribution limit for a future year', () => {
        const result = getTaxDeferredContributionLimit(2029);
        const expected = TAX_DEFERRED_CONTRIBUTION_LIMIT_2024 * (1 + TAX_DEFERRED_LIMIT_INFLATION_RATE / 100) ** (2029 - 2024);
        expect(result).toBeCloseTo(expected, 2);
    });

    it('calculates the elective contribution limit for the current year', () => {
        const result = getTaxDeferredElectiveContributionLimit(TAX_DEFERRED_DEFAULT_YEAR);
        expect(result).toBe(TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2024);
    });

    it('calculates the elective contribution limit for a future year', () => {
        const result = getTaxDeferredElectiveContributionLimit(2029);
        const expected = TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2024 * (1 + TAX_DEFERRED_LIMIT_INFLATION_RATE / 100) ** (2029 - 2024);
        expect(result).toBeCloseTo(expected, 2);
    });

    it('calculates the catch-up contribution limit for the current year', () => {
        const result = getTaxDeferredElectiveContributionCatchUpLimit(TAX_DEFERRED_DEFAULT_YEAR);
        expect(result).toBe(TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2024);
    });

    it('calculates the catch-up contribution limit for a future year', () => {
        const result = getTaxDeferredElectiveContributionCatchUpLimit(2029);
        const expected = TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2024 * (1 + TAX_DEFERRED_LIMIT_INFLATION_RATE / 100) ** (2029 - 2024);
        expect(result).toBeCloseTo(expected, 2);
    });

    it('handles edge cases, such as years before the default year', () => {
        const result = getTaxDeferredContributionLimit(2020); // Before the default year
        expect(result).toBeCloseTo(TAX_DEFERRED_CONTRIBUTION_LIMIT_2024 * (1 + TAX_DEFERRED_LIMIT_INFLATION_RATE / 100) ** (2020 - 2024), 2);
    });
});
