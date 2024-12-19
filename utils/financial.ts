import type {GrowthApplicationStrategy} from "~/models/plan/Plan";
import {InsufficientFundsStrategy} from "~/models/plan/Plan";

export function calculateCompoundInterest(principal: number, interestRate: number, numberOfInterestApplicationsPerPeriod: number = 1, numberOfPeriods: number): number {
    return principal * (1 + (interestRate / numberOfInterestApplicationsPerPeriod)) ** (numberOfInterestApplicationsPerPeriod * numberOfPeriods)
}

interface InvestmentGrowthAmountResult {
    contributionGrowth?: number;
    principalGrowth: number;
}

export function calculateInvestmentGrowthAmount(
    principal: number,
    growthRate: number,
    growthApplicationStrategy: GrowthApplicationStrategy,
    contribution?: number): InvestmentGrowthAmountResult {
    switch (growthApplicationStrategy) {
        case 'start':
            return {
                contributionGrowth: contribution,
                principalGrowth: principal * (growthRate / 100)
            }
        case 'end':
            assertDefined(contribution, 'contribution');
            return {
                contributionGrowth: contribution * growthRate / 100,
                principalGrowth: (principal + contribution) * (growthRate / 100)
            }
        default:
            throw new Error(`Invalid growth application strategy: ${growthApplicationStrategy}`);
    }
}


export function adjustForInsufficientFunds(
    requestedAmount: number,
    availableFunds: number, insufficientFundsStrategy: InsufficientFundsStrategy, minimum: number = 0,
): number {
    switch (insufficientFundsStrategy) {
        case InsufficientFundsStrategy.None:
            return Math.min(availableFunds, requestedAmount);
        case InsufficientFundsStrategy.MinimumOnly:
            return Math.max(Math.min(availableFunds, requestedAmount), minimum);
        case InsufficientFundsStrategy.Full:
            return requestedAmount;
        default:
            throw new Error(`Invalid insufficientFundsStrategy value: ${insufficientFundsStrategy}`);
    }
}