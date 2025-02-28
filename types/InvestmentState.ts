import type {BaseState} from "~/models/common/BaseState";

export interface State extends BaseState {
    contribution?: number;
    contributionLifetime: number;
    growthAmount?: number;
    growthLifetime: number;
    balanceStartOfYear: number;
    balanceEndOfYear?: number;
}