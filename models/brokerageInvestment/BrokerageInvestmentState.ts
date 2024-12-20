export default interface BrokerageInvestmentState {
    contribution: number;
    contributionLifetime: number;
    growthAmount: number;
    growthLifetime: number;
    balanceStartOfYear: number;
    balanceEndOfYear?: number;
    processed: boolean;
}