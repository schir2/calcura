import {describe, expect, it} from 'vitest';
import {adjustForInsufficientFunds, calculateCompoundInterest, calculateGrowthAmount, getAnnualAmount} from '@/utils/financial';
import {GrowthApplicationStrategy, InsufficientFundsStrategy} from "~/types/Plan";

import {Frequency} from "~/types/Frequency";

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

    describe('calculateGrowthAmount', () => {
        it('calculates growth correctly with "start" strategy', () => {
            const growthAmount = calculateGrowthAmount(
                1000, 5, GrowthApplicationStrategy.Start);
            expect(growthAmount).toBe(50);
        });

        it('calculates growth correctly with "end" strategy', () => {
            const growthAmount = calculateGrowthAmount(1000, 5, GrowthApplicationStrategy.End, 200,);
            expect(growthAmount).toBe(60);
        });

        it('handles zero principal with "start" strategy', () => {
            const growthAmount = calculateGrowthAmount(0, 5, GrowthApplicationStrategy.Start,);
            expect(growthAmount).toBe(0);
        });

        it('handles zero principal with "end" strategy', () => {
            const growthAmount = calculateGrowthAmount(0, 5, GrowthApplicationStrategy.End, 200,);

            expect(growthAmount).toBe(10);
        });

        it('handles zero growth rate with "start" strategy', () => {
            const growthAmount = calculateGrowthAmount(1000, 0, GrowthApplicationStrategy.Start,);

            expect(growthAmount).toBe(0);
        });

        it('handles zero growth rate with "end" strategy', () => {
            const growthAmount = calculateGrowthAmount(1000, 0, GrowthApplicationStrategy.End, 200,);

            expect(growthAmount).toBe(0);
        });

        it('handles fractional growth rates with "start" strategy', () => {
            const growthAmount = calculateGrowthAmount(1000, 3.75, GrowthApplicationStrategy.Start,);

            expect(growthAmount).toBe(37.5);
        });

        it('handles fractional growth rates with "end" strategy', () => {
            const growthAmount = calculateGrowthAmount(1000, 3.75, GrowthApplicationStrategy.End, 200,);
            expect(growthAmount).toBe(45);
        });

        it('throws an error for invalid growth application strategy', () => {
            expect(() =>
                calculateGrowthAmount(1000, 5, 'invalid_strategy' as any,)
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
    describe('getAnnualAmount', () => {
        it('should calculate annual amount for Monthly frequency', () => {
            expect(getAnnualAmount(100, Frequency.Monthly)).toBe(1200);
        });

        it('should calculate annual amount for Annually frequency', () => {
            expect(getAnnualAmount(500, Frequency.Annually)).toBe(500);
        });

        it('should calculate annual amount for Weekly frequency', () => {
            expect(getAnnualAmount(50, Frequency.Weekly)).toBe(2600);
        });

        it('should calculate annual amount for Quarterly frequency', () => {
            expect(getAnnualAmount(300, Frequency.Quarterly)).toBe(1200);
        });

        it('should return 0 for amount of 0, regardless of frequency', () => {
            expect(getAnnualAmount(0, Frequency.Monthly)).toBe(0);
            expect(getAnnualAmount(0, Frequency.Annually)).toBe(0);
            expect(getAnnualAmount(0, Frequency.Weekly)).toBe(0);
            expect(getAnnualAmount(0, Frequency.Quarterly)).toBe(0);
        });

        it('should handle negative amounts correctly', () => {
            expect(getAnnualAmount(-100, Frequency.Monthly)).toBe(-1200);
            expect(getAnnualAmount(-500, Frequency.Annually)).toBe(-500);
            expect(getAnnualAmount(-50, Frequency.Weekly)).toBe(-2600);
            expect(getAnnualAmount(-300, Frequency.Quarterly)).toBe(-1200);
        });

        it('should throw an error for invalid frequency', () => {
            expect(() => getAnnualAmount(100, 'InvalidFrequency' as Frequency)).toThrow();
        });
    });

})