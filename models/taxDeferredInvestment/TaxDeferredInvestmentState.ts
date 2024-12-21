export default interface TaxDeferredInvestmentState {
    electiveContribution?: number;
    electiveContributionLifetime: number;
    employerContribution?: number;
    employerContributionLifetime: number;
    growthAmount?: number;
    growthLifetime: number;
    balanceStartOfYear: number;
    balanceEndOfYear?: number;
    processed: boolean;
}
