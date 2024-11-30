import { describe, it, expect } from 'vitest';
import {
  calculateCompoundInterest,
  calculateInvestmentGrowthAmount,
  adjustContributionForDisposableIncome,
} from '../../utils/financial';

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
    const result = calculateInvestmentGrowthAmount({
      principal: 1000,
      growthRate: 5,
      growthApplicationStrategy: 'start',
    });
    expect(result).toBeCloseTo(50, 2); // 1000 * 5%
  });

  it('calculates growth correctly with "end" strategy', () => {
    const result = calculateInvestmentGrowthAmount({
      principal: 1000,
      growthRate: 5,
      growthApplicationStrategy: 'end',
      contribution: 200,
    });
    expect(result).toBeCloseTo(60, 2); // (1000 + 200) * 5%
  });

  it('throws an error for "end" strategy without a contribution', () => {
    expect(() =>
        calculateInvestmentGrowthAmount({
          principal: 1000,
          growthRate: 5,
          growthApplicationStrategy: 'end',
        })
    ).toThrow('contribution');
  });

  it('handles zero principal with "start" strategy', () => {
    const result = calculateInvestmentGrowthAmount({
      principal: 0,
      growthRate: 5,
      growthApplicationStrategy: 'start',
    });
    expect(result).toBe(0);
  });

  it('handles zero principal with "end" strategy', () => {
    const result = calculateInvestmentGrowthAmount({
      principal: 0,
      growthRate: 5,
      growthApplicationStrategy: 'end',
      contribution: 200,
    });
    expect(result).toBeCloseTo(10, 2); // 200 * 5%
  });

  it('handles zero growth rate with "start" strategy', () => {
    const result = calculateInvestmentGrowthAmount({
      principal: 1000,
      growthRate: 0,
      growthApplicationStrategy: 'start',
    });
    expect(result).toBe(0);
  });

  it('handles zero growth rate with "end" strategy', () => {
    const result = calculateInvestmentGrowthAmount({
      principal: 1000,
      growthRate: 0,
      growthApplicationStrategy: 'end',
      contribution: 200,
    });
    expect(result).toBe(0);
  });

  it('handles fractional growth rates with "start" strategy', () => {
    const result = calculateInvestmentGrowthAmount({
      principal: 1000,
      growthRate: 3.75,
      growthApplicationStrategy: 'start',
    });
    expect(result).toBeCloseTo(37.5, 2); // 1000 * 3.75%
  });

  it('handles fractional growth rates with "end" strategy', () => {
    const result = calculateInvestmentGrowthAmount({
      principal: 1000,
      growthRate: 3.75,
      growthApplicationStrategy: 'end',
      contribution: 200,
    });
    expect(result).toBeCloseTo(45, 2); // (1000 + 200) * 3.75%
  });

  it('throws an error for invalid growth application strategy', () => {
    expect(() =>
        calculateInvestmentGrowthAmount({
          principal: 1000,
          growthRate: 5,
          growthApplicationStrategy: 'invalid_strategy' as any,
        })
    ).toThrow('Invalid growth application strategy: invalid_strategy');
  });
});

describe('adjustContributionForDisposableIncome', () => {
  it('returns the minimum of contribution and disposable income for "none"', () => {
    const result = adjustContributionForDisposableIncome({
      amount: 500,
      disposableIncome: 300,
      allowNegativeDisposableIncome: 'none',
    });
    expect(result).toBe(300);
  });

  it('returns the minimum of contribution and disposable income for "minimum_only"', () => {
    const result = adjustContributionForDisposableIncome({
      amount: 500,
      disposableIncome: 300,
      allowNegativeDisposableIncome: 'minimum_only',
    });
    expect(result).toBe(300);
  });

  it('returns the full contribution for "full"', () => {
    const result = adjustContributionForDisposableIncome({
      amount: 500,
      disposableIncome: 300,
      allowNegativeDisposableIncome: 'full',
    });
    expect(result).toBe(500);
  });

  it('throws an error for an invalid allowNegativeDisposableIncome value', () => {
    expect(() =>
        adjustContributionForDisposableIncome({
          amount: 500,
          disposableIncome: 300,
          allowNegativeDisposableIncome: 'invalid' as any,
        })
    ).toThrow('Invalid allowNegativeDisposableIncome value: invalid');
  });
});
