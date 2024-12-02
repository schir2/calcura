import type BrokerageInvestmentConfig from './BrokerageInvestmentConfig';
import {adjustForAllowNegativeDisposableIncome, assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import type BrokerageInvestmentState from "~/models/brokerage/BrokerageInvestmentState";
import ManagerBase from "~/models/common/ManagerBase";
import type PlanState from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";
import type {AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";

export default class BrokerageInvestmentManager extends ManagerBase<BrokerageInvestmentConfig, BrokerageInvestmentState> {

    getContribution(
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
                contribution = disposableIncome
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

    calculateGrowthAmount(state: BrokerageInvestmentState): number {
        return calculateInvestmentGrowthAmount({
                principal: state.balanceStartOfYear,
                growthRate: this.config.growthRate,
                growthApplicationStrategy: this.config.growthApplicationStrategy,
                contribution: state.contribution
            }
        )
    }

    protected createInitialState(): BrokerageInvestmentState {
        return {
            contribution: 0,
            growthAmount: 0,
            balanceStartOfYear: this.config.initialBalance,
            balanceEndOfYear: undefined
        }
    }

    protected createNextState(previousState: BrokerageInvestmentState): BrokerageInvestmentState {
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
        const contribution = this.getContribution(planState.taxableIncome, planState.grossIncome, planState.allowNegativeDisposableIncome)
        const taxableIncome = planState.taxableIncome - contribution
        this.updateCurrentState(
            {
                ...currentState,

            }
        )
        return {
            ...planState,
            taxableIncome: taxableIncome
        }
    }
}
