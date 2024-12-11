import ManagerBase from "~/models/common/ManagerBase";
import type IncomeState from "~/models/income/IncomeState";
import type Income from "~/models/income/Income";
import type PlanState from "~/models/plan/PlanState";
import type Command from "~/models/common/Command";

export default class IncomeManager extends ManagerBase<Income, IncomeState> {
    protected createInitialState(): IncomeState {
        return {
            grossIncome: this.config.grossIncome
        }
    }

    protected createNextState(previousState: IncomeState): IncomeState {
        return {
            grossIncome: previousState.grossIncome + this.getGrowthAmount(previousState.grossIncome)
        }
    }

    protected getGrowthAmount(grossIncome: number): number {
        return grossIncome * this.config.growthRate / 100
    }

    getCommands(): Command[] {
        return [];
    }

    processImplementation(planState: PlanState): PlanState {
        return {
            ...planState,
        };
    }

}