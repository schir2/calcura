import type {BaseState} from "~/models/common/BaseState";

export interface InvestmentState extends BaseState {
    contribution?: number;
    contribution_lifetime: number;
    growth_amount?: number;
    growth_lifetime: number;
    balance_start_of_year: number;
    balance_end_of_year?: number;
}