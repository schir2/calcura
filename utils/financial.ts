import type {GrowthApplicationStrategy} from "~/types/Plan";
import {InsufficientFundsStrategy} from "~/types/Plan";

import {Frequency} from "~/types/Frequency";

export function calculateCompoundInterest(principal: number, interestRate: number, numberOfInterestApplicationsPerPeriod: number = 1, numberOfPeriods: number): number {
    return principal * (1 + (interestRate / numberOfInterestApplicationsPerPeriod)) ** (numberOfInterestApplicationsPerPeriod * numberOfPeriods)
}

export function calculateInvestmentGrowthAmount(
    principal: number,
    growthRate: number,
    growthApplicationStrategy: GrowthApplicationStrategy,
    contribution?: number): number {
    switch (growthApplicationStrategy) {
        case 'start':
            return principal * (growthRate / 100)

        case 'end':
            return (principal + (contribution ?? 0)) * (growthRate / 100)
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

export function getAnnualAmount(amount: number, frequency: Frequency): number {
    switch (frequency) {
        case Frequency.Monthly:
            return amount * 12
        case Frequency.Annually:
            return amount
        case Frequency.Weekly:
            return amount * 52
        case Frequency.Quarterly:
            return amount * 4
        case Frequency.Biweekly:
            return amount * 26
        default:
            throw new Error(`Invalid frequency value: ${frequency}`);
    }
}