import type {InvestmentState} from "~/models/common/InvestmentState";

export default interface TaxDeferredInvestmentState extends InvestmentState {
    electiveContribution?: number;
    electiveContributionLifetime: number;
    employerContribution?: number;
    employerContributionLifetime: number;
}
