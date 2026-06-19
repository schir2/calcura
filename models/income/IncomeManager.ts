import BaseManager from "~/models/common/BaseManager";
import type {IncomeState} from "~/types/IncomeState";
import type {Income} from "~/types/Income";

export class IncomeManager extends BaseManager<Income, IncomeState> {
    protected createInitialState(): IncomeState {
        return {
            gross_income: this.config.gross_income,
            processed: false,
        }
    }

    createNextState(previousState: IncomeState): IncomeState {
        return {
            gross_income: previousState.gross_income + this.getGrowthAmount(previousState.gross_income),
            processed: false,
        }
    }

    protected getGrowthAmount(grossIncome: number): number {
        return grossIncome * this.config.growth_rate / 100
    }

    processImplementation(): void {
    }

}