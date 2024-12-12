import type {IraInvestment} from './IraInvestment';
import {adjustForAllowNegativeDisposableIncome, assertDefined} from "~/utils";
import type IraInvestmentState from "~/models/iraInvestment/IraInvestmentState";
import ManagerBase from "~/models/common/ManagerBase";
import type {PlanState} from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";
import type {AllowNegativeDisposableIncome} from "~/models/plan/Plan";

export default class IraInvestmentManager extends ManagerBase<IraInvestment, IraInvestmentState> {

    getContribution(
        limit: number,
        disposableIncome: number,
        incomePreTaxed?: number,
        allowNegativeDisposableIncome: AllowNegativeDisposableIncome = 'none'
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
        return adjustForAllowNegativeDisposableIncome(
            {
                amount: contribution,
                disposableIncome: disposableIncome,
                allowNegativeDisposableIncome: allowNegativeDisposableIncome
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
        const contribution = this.getContribution(999999, planState.taxedIncome, planState.taxableIncome, planState.allowNegativeDisposableIncome)
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
