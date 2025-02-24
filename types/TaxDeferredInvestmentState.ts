import type {InvestmentState} from "~/types/InvestmentState";

export default interface TaxDeferredInvestmentState extends InvestmentState {
    electiveContribution?: number;
    electiveContributionLifetime: number;
    employerContribution?: number;
    employerContributionLifetime: number;
}
