import {BrokerageContributionStrategy, type BrokerageInvestment} from './BrokerageInvestment';
import {assertDefined, calculateInvestmentGrowthAmount} from "~/utils";
import type BrokerageInvestmentState from "~/models/brokerageInvestment/BrokerageInvestmentState";
import BaseManager from "~/models/common/BaseManager";
import type {PlanState} from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";
import type {GrowthApplicationStrategy} from "~/models/plan/Plan";

export default class BrokerageInvestmentManager extends BaseManager<BrokerageInvestment, BrokerageInvestmentState> {

    calculateContribution(state: BrokerageInvestmentState
    ): number {
        let contribution = 0
        const planState = this.orchestrator.getCurrentState();
        switch (this.config.contributionStrategy) {
            case BrokerageContributionStrategy.Fixed:
                contribution = this.config.contributionFixedAmount
                break
            case BrokerageContributionStrategy.PercentageOfIncome:
                contribution = planState.grossIncome * (this.config.contributionPercentage / 100)
                break
            case BrokerageContributionStrategy.Max:
                contribution = planState.taxedCapital
                break
        }
        return contribution
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
        const contribution = this.calculateContribution(planState.taxableIncome, planState.grossIncome, planState.insufficientFundsStrategy)
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