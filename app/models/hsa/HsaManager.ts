import type {Hsa} from '#shared/types/Hsa';
import {assertDefined} from "~/utils";
import type {HsaState} from "#shared/types/HsaState";
import {InvestmentAccountManager} from "~/models/common/InvestmentAccountManager";
import type {TaxCategory} from "~/models/common/InvestableManager";
import {FundType} from "~/models/plan/PlanManager";
import {ContributionType} from "#shared/types/ContributionType";
import {HSA_CONTRIBUTION_LIMIT_2024} from "~/constants/HsaConstants";

export class HsaManager extends InvestmentAccountManager<Hsa, HsaState> {
    readonly taxCategory: TaxCategory = 'tax_deferred';
    protected readonly contributionType = ContributionType.Hsa;
    protected readonly fundType = FundType.Taxable;


    protected createInitialState(): HsaState {
        return {
            contribution: undefined,
            contribution_lifetime: 0,
            growth_amount: undefined,
            growth_lifetime: 0,
            balance_start_of_year: this.config.initial_balance,
            balance_end_of_year: undefined,
            processed: false,
        }
    }

    calculateContribution(): number {
        return calculateHsaContribution(
            this.config,
            this.orchestrator.getCurrentState().limits.hsa,
        );
    }

    createNextState(previousState: HsaState): HsaState {
        assertDefined(previousState.balance_end_of_year, 'balanceEndOfYear')
        return {
            contribution: undefined,
            contribution_lifetime: previousState.contribution_lifetime,
            growth_amount: undefined,
            growth_lifetime: previousState.growth_lifetime,
            balance_start_of_year: previousState.balance_end_of_year,
            balance_end_of_year: undefined,
            processed: false,
        };
    }

}

export function calculateHsaContribution(hsaConfig: Hsa, hsaLimit: number = HSA_CONTRIBUTION_LIMIT_2024): number {
    let contribution = 0
    switch (hsaConfig.contribution_strategy) {
        case 'fixed':
            contribution = hsaConfig.contribution_fixed_amount ?? 0
            break
        case 'max':
            contribution = hsaLimit
            break
    }
    return Math.min(contribution, hsaLimit)
}