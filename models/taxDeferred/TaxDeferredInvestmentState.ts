export interface TaxDeferredInvestmentState {
    year: number;
    balanceStartOfYear: number;

    electiveContribution: number;
    employerContribution: number;

    growthAmount: number;
    balanceEndOfYear: number;

    // Optional: Add any other fields you need for tracking
}

export class TaxDeferredInvestmentState {
    year: number;
    balanceStartOfYear: number;
    electiveContribution: number;
    employerContribution: number;
    growthAmount: number;
    balanceEndOfYear: number;

    constructor(data: TaxDeferredInvestmentState) {
        this.year = data.year;
        this.balanceStartOfYear = data.balanceStartOfYear;

        this.electiveContribution = data.electiveContribution;
        this.employerContribution = data.employerContribution;

        this.growthAmount = data.growthAmount;
        this.balanceEndOfYear = data.balanceEndOfYear;
    }
}
