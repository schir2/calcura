import type {IraInvestment} from './IraInvestment';
import {adjustForInsufficientFunds, assertDefined} from "~/utils";
import type IraInvestmentState from "~/models/iraInvestment/IraInvestmentState";
import BaseManager from "~/models/common/BaseManager";
import type {PlanState} from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";
import type {InsufficientFundsStrategy} from "~/models/plan/Plan";

export default class IraInvestmentManager extends BaseManager<IraInvestment, IraInvestmentState> {

    getContribution(
        limit: number,
        disposableIncome: number,
        incomePreTaxed?: number,
        insufficientFundsStrategy: InsufficientFundsStrategy = 'none'
    ): number {
        let contribution = 0
        switch (this.config.contributionStrategy) {
            case 'fixed':
                contribution = this.config.contributionFixedAmount
                break
            case 'percentage_of_income':
                assertDefined(incomePreTaxed, 'incomePreTaxed')
                contribution = incomePreTaxed * (this.config.contributionPercentage / 100)
                break
            case "max":
                contribution = limit
                break
        }
        return adjustForInsufficientFunds(
            {
                amount: contribution,
                availableFunds: disposableIncome,
                insufficientFundsStrategy: InsufficientFundsStrategy
            }
        )
    }

    protected createInitialState(): IraInvestmentState {
        return {
            contribution: 0,
            growthAmount: 0,
            balanceStartOfYear: this.config.initialBalance,
            balanceEndOfYear: undefined
        }
    }

    protected createNextState(previousState: IraInvestmentState): IraInvestmentState {
        assertDefined(previousState.balanceEndOfYear, 'balanceEndOfYear')
        return {
            contribution: 0,
            growthAmount: 0,
            balanceStartOfYear: previousState.balanceEndOfYear,
            balanceEndOfYear: undefined
        };
    }

    getCommands(): Command[] {
        return [];
    }

    processImplementation(planState: PlanState): PlanState {
        const currentState = this.getCurrentState()
        const contribution = this.getContribution(999999, planState.taxedIncome, planState.taxableIncome, planState.insufficientFundsStrategy)
        const balanceEndOfYear = currentState.balanceStartOfYear + contribution
        this.updateCurrentState(
            {
                ...currentState,
                contribution: contribution,
                balanceEndOfYear: balanceEndOfYear,
            }
        )
        return {
            ...planState,
        }
    }
}
