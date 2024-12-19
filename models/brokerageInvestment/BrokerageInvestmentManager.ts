import type {BrokerageInvestment} from './BrokerageInvestment';
import {adjustForInsufficientFunds, assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import type BrokerageInvestmentState from "~/models/brokerageInvestment/BrokerageInvestmentState";
import BaseManager from "~/models/common/BaseManager";
import type {PlanState} from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";
import type {InsufficientFundsStrategy, GrowthApplicationStrategy} from "~/models/plan/Plan";

export default class BrokerageInvestmentManager extends BaseManager<BrokerageInvestment, BrokerageInvestmentState> {

    getContribution(
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
                contribution = disposableIncome
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

    calculateGrowthAmount(state: BrokerageInvestmentState, growthApplicationStrategy: GrowthApplicationStrategy): number {
        return calculateInvestmentGrowthAmount({
                principal: state.balanceStartOfYear,
                growthRate: this.config.growthRate,
                growthApplicationStrategy: growthApplicationStrategy,
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
        const contribution = this.getContribution(planState.taxableIncome, planState.grossIncome, planState.insufficientFundsStrategy)
        const taxedIncome = planState.taxedIncome - contribution
        const balanceEndOfYear = currentState.balanceStartOfYear + this.calculateGrowthAmount(currentState, planState.growthApplicationStrategy)
        this.updateCurrentState(
            {
                ...currentState,
                balanceEndOfYear: balanceEndOfYear

            }
        )
        return {
            ...planState,
            taxedIncome: taxedIncome
        }
    }
}