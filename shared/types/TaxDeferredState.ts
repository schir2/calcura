import type {InvestmentState} from "#shared/types/InvestmentState";

export type TaxDeferredState = InvestmentState & {
    elective_contribution?: number;
    elective_contribution_lifetime: number;
    employer_contribution?: number;
    employer_contribution_lifetime: number;
}