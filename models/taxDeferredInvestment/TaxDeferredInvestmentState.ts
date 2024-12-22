import type {BaseState} from "~/models/common/BaseState";

export default interface TaxDeferredInvestmentState extends BaseState {
    electiveContribution?: number;
    electiveContributionLifetime: number;
    employerContribution?: number;
    employerContributionLifetime: number;
    growthAmount?: number;
    growthLifetime: number;
    balanceStartOfYear: number;
    balanceEndOfYear?: number;
}
