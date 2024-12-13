import type {AllowNegativeDisposableIncome, GrowthApplicationStrategy} from "~/models/plan/Plan";

export function calculateCompoundInterest(principal: number, interestRate: number, numberOfInterestApplicationsPerPeriod: number = 1, numberOfPeriods: number): number {
    return principal * (1 + (interestRate / numberOfInterestApplicationsPerPeriod)) ** (numberOfInterestApplicationsPerPeriod * numberOfPeriods)
}

export function calculateInvestmentGrowthAmount(
    {
        principal,
        growthRate,
        growthApplicationStrategy,
        contribution,
    }: {
        principal: number;
        growthRate: number;
        growthApplicationStrategy: GrowthApplicationStrategy;
        contribution?: number;
    }): number {
    switch (growthApplicationStrategy) {
        case 'start':
            return principal * (growthRate / 100);
        case 'end':
            assertDefined(contribution, 'contribution');
            return (principal + contribution) * (growthRate / 100);
        default:
            throw new Error(`Invalid growth application strategy: ${growthApplicationStrategy}`);
    }
}


export function adjustForAllowNegativeDisposableIncome(
    {disposableIncome, amount, minimum = 0, allowNegativeDisposableIncome}: {
        disposableIncome: number, amount: number, minimum?: number, allowNegativeDisposableIncome: AllowNegativeDisposableIncome
    }
): number {
    switch (allowNegativeDisposableIncome) {
        case 'none':
            return Math.max(Math.min(amount, disposableIncome), minimum);
        case 'minimum_only':
            return Math.max(Math.min(amount, disposableIncome), minimum);
        case 'full':
            return amount;
        default:
            throw new Error(`Unknown AllowNegativeDisposableIncome option: ${allowNegativeDisposableIncome}`);
    }
}