import {describe, expect, it} from 'vitest';
import {adjustForInsufficientFunds, calculateCompoundInterest, calculateInvestmentGrowthAmount} from '@/utils/financial';
import {InsufficientFundsStrategy} from "~/models/plan/Plan";

describe('financialUtils', () => {

    describe('calculateCompoundInterest', () => {
        it('calculates compound interest correctly for annual compounding', () => {
            const result = calculateCompoundInterest(1000, 0.05, 1, 10);
            expect(result).toBeCloseTo(1628.89, 2); // Validate up to two decimal places
        });

        it('calculates compound interest correctly for monthly compounding', () => {
            const result = calculateCompoundInterest(1000, 0.05, 12, 10);
            expect(result).toBeCloseTo(1647.01, 2); // Validate up to two decimal places
        });

        it('returns the principal when interest rate and periods are zero', () => {
            const result = calculateCompoundInterest(1000, 0, 1, 0);
            expect(result).toBe(1000);
        });

        it('handles edge cases like zero principal', () => {
            const result = calculateCompoundInterest(0, 0.05, 1, 10);
            expect(result).toBe(0);
        });
    });

    describe('calculateInvestmentGrowthAmount', () => {
        it('calculates growth correctly with "start" strategy', () => {
            const result = calculateInvestmentGrowthAmount(
                1000, 5, 'start');
            expect(result.principalGrowth).toBe(50);
            expect(result.contributionGrowth).toBe(undefined);
        });

        it('calculates growth correctly with "end" strategy', () => {
            const result = calculateInvestmentGrowthAmount(1000, 5, 'end', 200,);
            expect(result.principalGrowth).toBe(60);
            expect(result.contributionGrowth).toBe(10);
        });

        it('throws an error for "end" strategy without a contribution', () => {
            expect(() =>
                calculateInvestmentGrowthAmount(1000, 5, 'end',)
            ).toThrow('contribution');
        });

        it('handles zero principal with "start" strategy', () => {
            const result = calculateInvestmentGrowthAmount(0, 5, 'start',);
            expect(result.principalGrowth).toBe(0);
            expect(result.contributionGrowth).toBe(undefined);
        });

        it('handles zero principal with "end" strategy', () => {
            const result = calculateInvestmentGrowthAmount(0, 5, 'end', 200,);

            expect(result.principalGrowth).toBe(10);
            expect(result.contributionGrowth).toBe(10);
        });

        it('handles zero growth rate with "start" strategy', () => {
            const result = calculateInvestmentGrowthAmount(1000, 0, 'start',);

            expect(result.principalGrowth).toBe(0);
            expect(result.contributionGrowth).toBe(undefined);
        });

        it('handles zero growth rate with "end" strategy', () => {
            const result = calculateInvestmentGrowthAmount(1000, 0, 'end', 200,);

            expect(result.principalGrowth).toBe(0);
            expect(result.contributionGrowth).toBe(0);
        });

        it('handles fractional growth rates with "start" strategy', () => {
            const result = calculateInvestmentGrowthAmount(1000, 3.75, 'start',);

            expect(result.principalGrowth).toBe(37.5);
            expect(result.contributionGrowth).toBe(undefined);
        });

        it('handles fractional growth rates with "end" strategy', () => {
            const result = calculateInvestmentGrowthAmount(1000, 3.75, 'end', 200,);
            expect(result.principalGrowth).toBe(45);
            expect(result.contributionGrowth).toBe(7.5);
        });

        it('throws an error for invalid growth application strategy', () => {
            expect(() =>
                calculateInvestmentGrowthAmount(1000, 5, 'invalid_strategy' as any,)
            ).toThrow('Invalid growth application strategy: invalid_strategy');
        });
    });

    describe('adjustForInsufficientFunds', () => {
        it('returns the minimum of contribution and disposable income for "none"', () => {
            const result = adjustForInsufficientFunds(
                500,
                300,
                InsufficientFundsStrategy.None,
            );
            expect(result).toBe(300);
        });

        it('returns the minimum of contribution and disposable income for "minimum_only"', () => {
            const result = adjustForInsufficientFunds(
                500,
                300,
                InsufficientFundsStrategy.MinimumOnly,
            );
            expect(result).toBe(300);
        });

        it('returns the full contribution for "full"', () => {
            const result = adjustForInsufficientFunds(
                500,
                300,
                InsufficientFundsStrategy.Full,
            );
            expect(result).toBe(500);
        });

        it('throws an error for an invalid insufficientFundsStrategy value', () => {
            expect(() =>
                adjustForInsufficientFunds(
                    500,
                    300,
                    'invalid' as any,
                )
            ).toThrow('Invalid insufficientFundsStrategy value: invalid');
        });
    });
})