import BaseManager from "~/models/common/BaseManager";
import type IncomeState from "~/types/IncomeState";
import type {Income} from "~/types/Income";

export class IncomeManager extends BaseManager<Income, IncomeState> {
    protected createInitialState(): IncomeState {
        return {
            grossIncome: this.config.grossIncome,
            processed: false,
        }
    }

    createNextState(previousState: IncomeState): IncomeState {
        return {
            grossIncome: previousState.grossIncome + this.getGrowthAmount(previousState.grossIncome),
            processed: false,
        }
    }

    protected getGrowthAmount(grossIncome: number): number {
        return grossIncome * this.config.growthRate / 100
    }

    processImplementation(): void {
    }

}