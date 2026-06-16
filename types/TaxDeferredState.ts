import type {InvestmentState} from "~/types/InvestmentState";

export default interface TaxDeferredState extends InvestmentState {
    elective_contribution?: number;
    elective_contribution_lifetime: number;
    employer_contribution?: number;
    employer_contribution_lifetime: number;
}
