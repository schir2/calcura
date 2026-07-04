import BaseManager from "~/models/common/BaseManager";
import type {IncomeState} from "#shared/types/IncomeState";
import type {Income} from "#shared/types/Income";

export class IncomeManager extends BaseManager<Income, IncomeState> {
    protected createInitialState(): IncomeState {
        return {
            gross_income: this.config.gross_income,
            processed: false,
        }
    }

    createNextState(previousState: IncomeState): IncomeState {
        // Income stops after retirement (#66). Zeroing gross_income here cascades to everything
        // that reads it — plan income totals and contribution calcs (401k/IRA percentage_of_income,
        // employer match) that pull `incomeManager.getCurrentState().gross_income` directly.
        return {
            gross_income: this.orchestrator.getCurrentState().retired
                ? 0
                : previousState.gross_income + this.getGrowthAmount(previousState.gross_income),
            processed: false,
        }
    }

    protected getGrowthAmount(grossIncome: number): number {
        return grossIncome * this.config.growth_rate / 100
    }

    processImplementation(): void {
    }

}