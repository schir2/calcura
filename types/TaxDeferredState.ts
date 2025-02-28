import type {InvestmentState} from "~/types/InvestmentState";

export default interface TaxDeferredState extends InvestmentState {
    electiveContribution?: number;
    electiveContributionLifetime: number;
    employerContribution?: number;
    employerContributionLifetime: number;
}
