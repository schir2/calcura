export default interface TaxDeferredInvestmentState {
    electiveContribution?: number;
    employerContribution?: number;
    growthAmount: number;
    balanceStartOfYear: number;
    balanceEndOfYear?: number;
    processed: boolean;
}
