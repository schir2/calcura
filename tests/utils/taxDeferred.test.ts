import {describe, expect, it} from 'vitest';
import {getTaxDeferredContributionLimit, getTaxDeferredElectiveContributionCatchUpLimit, getTaxDeferredElectiveContributionLimit,} from '~/utils';


import {TAX_DEFERRED_CONTRIBUTION_LIMIT_2025, TAX_DEFERRED_DEFAULT_YEAR, TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2025, TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2025, TAX_DEFERRED_LIMIT_INFLATION_RATE} from "~/models/taxDeferred/TaxDeferredConstants";

describe('Tax Deferred Contribution Limit Calculations', () => {
    it('calculates the tax deferred contribution limit for the current year', () => {
        const result = getTaxDeferredContributionLimit(TAX_DEFERRED_DEFAULT_YEAR, DEFAULT_AGE);
        expect(result).toBe(TAX_DEFERRED_CONTRIBUTION_LIMIT_2025);
    });

    it('calculates the tax deferred contribution limit for a future year', () => {
        const result = getTaxDeferredContributionLimit(2029, DEFAULT_AGE);
        const expected = TAX_DEFERRED_CONTRIBUTION_LIMIT_2025 * (1 + TAX_DEFERRED_LIMIT_INFLATION_RATE / 100) ** (2029 - TAX_DEFERRED_DEFAULT_YEAR);
        expect(result).toBeCloseTo(expected, 2);
    });

    it('calculates the elective contribution limit for the current year', () => {
        const result = getTaxDeferredElectiveContributionLimit(TAX_DEFERRED_DEFAULT_YEAR, DEFAULT_AGE);
        expect(result).toBe(TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2025);
    });

    it('calculates the elective contribution limit for a future year', () => {
        const result = getTaxDeferredElectiveContributionLimit(2029, DEFAULT_AGE);
        const expected = TAX_DEFERRED_ELECTIVE_CONTRIBUTION_LIMIT_2025 * (1 + TAX_DEFERRED_LIMIT_INFLATION_RATE / 100) ** (2029 - TAX_DEFERRED_DEFAULT_YEAR);
        expect(result).toBeCloseTo(expected, 2);
    });

    it('calculates the catch-up contribution limit for the current year', () => {
        const result = getTaxDeferredElectiveContributionCatchUpLimit(TAX_DEFERRED_DEFAULT_YEAR);
        expect(result).toBe(TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2025);
    });

    it('calculates the catch-up contribution limit for a future year', () => {
        const result = getTaxDeferredElectiveContributionCatchUpLimit(2029);
        const expected = TAX_DEFERRED_ELECTIVE_CONTRIBUTION_CATCH_UP_LIMIT_2025 * (1 + TAX_DEFERRED_LIMIT_INFLATION_RATE / 100) ** (2029 - TAX_DEFERRED_DEFAULT_YEAR);
        expect(result).toBeCloseTo(expected, 2);
    });

    it('handles edge cases, such as years before the default year', () => {
        const result = getTaxDeferredContributionLimit(2020, DEFAULT_AGE); // Before the default year
        expect(result).toBeCloseTo(TAX_DEFERRED_CONTRIBUTION_LIMIT_2025 * (1 + TAX_DEFERRED_LIMIT_INFLATION_RATE / 100) ** (2020 - TAX_DEFERRED_DEFAULT_YEAR), 2);
    });
});
