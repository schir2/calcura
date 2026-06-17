import type {GrowthApplicationStrategy, InsufficientFundsStrategy} from "~/types/Plan";
import type {Frequency} from "~/types/Frequency";

export function calculateCompoundInterest(principal: number, interestRate: number, numberOfInterestApplicationsPerPeriod: number = 1, numberOfPeriods: number): number {
    return principal * (1 + (interestRate / numberOfInterestApplicationsPerPeriod)) ** (numberOfInterestApplicationsPerPeriod * numberOfPeriods)
}

export function calculateGrowthAmount(
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
        case 'none':
            return Math.max(Math.min(availableFunds, requestedAmount),0);
        case 'minimum_only':
            return Math.max(Math.min(availableFunds, requestedAmount), minimum);
        case 'full':
            return requestedAmount;
        default:
            throw new Error(`Invalid insufficientFundsStrategy value: ${insufficientFundsStrategy}`);
    }
}

export function getAnnualAmount(amount: number, frequency: Frequency): number {
    switch (frequency) {
        case 'monthly':
            return amount * 12
        case 'annual':
            return amount
        case 'weekly':
            return amount * 52
        case 'quarterly':
            return amount * 4
        case 'biweekly':
            return amount * 26
        default:
            throw new Error(`Invalid frequency value: ${frequency}`);
    }
}
