import type {InvestmentState} from "~/types/InvestmentState";

type TaxDeferredState = InvestmentState & {
    elective_contribution?: number;
    elective_contribution_lifetime: number;
    employer_contribution?: number;
    employer_contribution_lifetime: number;
}

export default TaxDeferredState
