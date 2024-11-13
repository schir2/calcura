import { describe, it, expect } from 'vitest';
import {calculateCompoundInterest, calculateInvestmentGrowthAmount} from './financial';

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

describe('calculateInvestmentGrowth', () => {
  it('calculates growth correctly with "start" strategy', () => {
    const result = calculateInvestmentGrowthAmount(1000, 5, 'start');
    expect(result).toBeCloseTo(50, 2); // 1000 * 5%
  });

  it('calculates growth correctly with "end" strategy', () => {
    const result = calculateInvestmentGrowthAmount(1000, 5, 'end', 200);
    expect(result).toBeCloseTo(60, 2); // (1000 + 200) * 5%
  });

  it('throws an error for "end" strategy without a contribution', () => {
    expect(() => calculateInvestmentGrowthAmount(1000, 5, 'end')).toThrow(
        'contribution'
    );
  });

  it('handles zero principal with "start" strategy', () => {
    const result = calculateInvestmentGrowthAmount(0, 5, 'start');
    expect(result).toBe(0);
  });

  it('handles zero principal with "end" strategy', () => {
    const result = calculateInvestmentGrowthAmount(0, 5, 'end', 200);
    expect(result).toBeCloseTo(10, 2); // 200 * 5%
  });

  it('handles zero growth rate with "start" strategy', () => {
    const result = calculateInvestmentGrowthAmount(1000, 0, 'start');
    expect(result).toBe(0);
  });

  it('handles zero growth rate with "end" strategy', () => {
    const result = calculateInvestmentGrowthAmount(1000, 0, 'end', 200);
    expect(result).toBe(0);
  });

  it('handles fractional growth rates with "start" strategy', () => {
    const result = calculateInvestmentGrowthAmount(1000, 3.75, 'start');
    expect(result).toBeCloseTo(37.5, 2); // 1000 * 3.75%
  });

  it('handles fractional growth rates with "end" strategy', () => {
    const result = calculateInvestmentGrowthAmount(1000, 3.75, 'end', 200);
    expect(result).toBeCloseTo(45, 2); // (1000 + 200) * 3.75%
  });

  it('throws an error for invalid growth application strategy', () => {
    expect(() =>
        calculateInvestmentGrowthAmount(1000, 5, 'invalid_strategy' as any)
    ).toThrow('Invalid growth application strategy: invalid_strategy');
  });

});